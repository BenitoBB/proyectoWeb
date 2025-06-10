/**
 * Endpoint principal para procesar la respuesta de un jugador.
 * Valida si la respuesta es correcta, gestiona strikes y modo robo,
 * actualiza la base de datos y publica el nuevo estado por MQTT.
 */

/* Importaciones necesarias */
import db from "@/lib/db";
import { mqttSendMessage } from "@/utils/serverMqtt";
import { TOPICS } from "@/utils/constants";

export default async function handler(req, res) {
  /* 1. Validación y obtención de datos */
  // 1.1 Solo acepta peticiones POST
  if (req.method !== "POST") return res.status(405).end();

  // 1.2 Si el body viene como string (por ejemplo, desde curl), lo parsea
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }

  // 1.3 Extrae los datos principales de la petición
  const { jugador, respuesta, preguntaId, rondaId } = body;

  /* 2. Consulta de la Base de Datos */
  // 2.1 Obtiene el estado actual de la ronda
  const [[ronda]] = await db.query(
    "SELECT * FROM Rondas WHERE ronda_id = ?",
    [rondaId]
  );
  if (!ronda) return res.status(404).json({ error: "Ronda no encontrada" });

  // 2.2 Obtiene las respuestas ya acertadas en esta ronda
  const [acertadasRows] = await db.query(
    "SELECT respuesta_id FROM Respuestas_Acertadas WHERE ronda_id = ?",
    [rondaId]
  );
  const respuestasAcertadas = acertadasRows.map(r => r.respuesta_id);

  // 2.3 Obtiene todas las respuestas válidas para la pregunta
  const [respuestas] = await db.query(
    "SELECT * FROM Respuestas WHERE pregunta_id = ? ORDER BY puntaje DESC",
    [preguntaId]
  );

  // 2.4 Mapea los IDs de respuestas acertadas a sus textos
  const respuestasAcertadasTextos = respuestas
    .filter(r => respuestasAcertadas.includes(r.respuesta_id))
    .map(r => r.texto_respuesta);

  // 2.5 Busca si la respuesta enviada es válida y no ha sido acertada antes
  const limpia = respuesta.trim().toLowerCase();
  let respuestaCorrecta = null;
  for (const r of respuestas) {
    if (
      r.texto_respuesta.toLowerCase() === limpia &&
      !respuestasAcertadas.includes(r.respuesta_id)
    ) {
      respuestaCorrecta = r;
      break;
    }
  }

  // Variables auxiliares para el flujo de juego
  let esMasFamosa = false;
  let mensaje = "";
  let turnoActual = ronda.turno_actual;

  // 3. Lógica de strikes y modo robo
  let strikesA = ronda.strikes_jugadorA;
  let strikesB = ronda.strikes_jugadorB;
  let puedeRobar = ronda.puede_robar;
  let robando = ronda.robando;

  // 3.1 Solo procesa si el jugador es el que tiene el turno
  if (turnoActual && jugador !== turnoActual) {
    return res.status(200).json({
      acertada: false,
      esMasFamosa: false,
      turno: turnoActual,
      mensaje: "No es tu turno.",
      respuestasAcertadas: respuestasAcertadasTextos,
    });
  }

  // 3.2 Si está activo el modo robo y el jugador que responde es el que puede robar
  if (puedeRobar && robando === jugador) {
    if (respuestaCorrecta) {
      mensaje = "¡Robaste los puntos!";
    } else {
      mensaje = "No lograste robar. Los puntos se quedan con el otro jugador.";
    }
  }

  /* 4. Procesamiento de la respuesta */
  else if (respuestaCorrecta) {
    // 4.1 Si la respuesta es correcta y no ha sido acertada antes, la registra en la BD
    if (!respuestasAcertadas.includes(respuestaCorrecta.respuesta_id)) {
      await db.query(
        "INSERT INTO Respuestas_Acertadas (ronda_id, respuesta_id) VALUES (?, ?)",
        [rondaId, respuestaCorrecta.respuesta_id]
      );
    }

    // 4.2 Vuelve a consultar las respuestas acertadas para actualizar el estado
    const [acertadasRows] = await db.query(
      "SELECT respuesta_id FROM Respuestas_Acertadas WHERE ronda_id = ?",
      [rondaId]
    );
    const respuestasAcertadasIds = acertadasRows.map(r => r.respuesta_id);
    const respuestasAcertadasTextos = respuestas
      .filter(r => respuestasAcertadasIds.includes(r.respuesta_id))
      .map(r => r.texto_respuesta);

    // 4.3 Publica el tablero actualizado por MQTT para que todos los clientes lo vean
    mqttSendMessage(TOPICS.ESTADO_TABLERO, JSON.stringify({
      respuestasAcertadas: respuestasAcertadasTextos,
      strikesA,
      strikesB,
      puedeRobar,
      robando,
    }));

    // 4.4 Si ya se acertaron todas las respuestas, publica el ganador
    if (respuestasAcertadasIds.length === respuestas.length) {
      mqttSendMessage(TOPICS.GANADOR, jugador);
    }

    // 4.5 Verifica si la respuesta es la más famosa (mayor puntaje)
    const maxPuntaje = Math.max(...respuestas.map(r => r.puntaje));
    esMasFamosa = respuestaCorrecta.puntaje === maxPuntaje;

    /* 5. Duelo de rapidez */
    // 5.1 Si la ronda está en duelo rápido
    if (ronda.duelo_rapido === 1) {
      if (esMasFamosa) {
        // 5.1.1 Si acierta la más famosa, termina el duelo rápido
        await db.query(
          "UPDATE Rondas SET duelo_rapido = 0 WHERE ronda_id = ?",
          [rondaId]
        );
        mensaje = "¡Correcto! Es la respuesta más famosa. Sigues jugando.";
      } else {
        // 5.1.2 Si acierta otra, también termina el duelo rápido
        await db.query(
          "UPDATE Rondas SET duelo_rapido = 0 WHERE ronda_id = ?",
          [rondaId]
        );
        mensaje = "¡Correcto! Sigues jugando.";
      }
    } else {
      // 5.2 Flujo normal después del duelo rápido
      mensaje = esMasFamosa
        ? "¡Correcto! Es la respuesta más famosa. Sigues jugando."
        : "¡Correcto! Sigues jugando.";
      // 5.2.1 El turno no cambia, el jugador sigue jugando
    }
  }
  /* 6. Respuesta incorrecta */
  else {
    // 6.1 Suma un strike al jugador correspondiente
    if (jugador === "Jugador A") strikesA++;
    else strikesB++;

    // 6.2 Limita los strikes a un máximo de 2
    if (strikesA > 2) strikesA = 2;
    if (strikesB > 2) strikesB = 2;

    // 6.3 Actualiza los strikes en la base de datos
    await db.query(
      "UPDATE Rondas SET strikes_jugadorA = ?, strikes_jugadorB = ? WHERE ronda_id = ?",
      [strikesA, strikesB, rondaId]
    );

    // 6.4 Si llega a 2 strikes, activa modo robo y cambia el turno
    if ((jugador === "Jugador A" && strikesA >= 2) || (jugador === "Jugador B" && strikesB >= 2)) {
      puedeRobar = true;
      robando = jugador === "Jugador A" ? "Jugador B" : "Jugador A";
      turnoActual = robando; // Cambia el turno al que va a robar
      await db.query(
        "UPDATE Rondas SET puede_robar = 1, robando = ?, turno_actual = ? WHERE ronda_id = ?",
        [robando, turnoActual, rondaId]
      );
      mensaje = `¡2 strikes! El otro jugador puede intentar robar.`;
    } else {
      mensaje = `Strike ${jugador === "Jugador A" ? strikesA : strikesB}. Sigue intentando.`;
      // El turno no cambia, el mismo jugador sigue intentando hasta 2 strikes
    }
  }

  /* 7. Publica el turno actual por MQTT para que todos los clientes se actualicen */
  mqttSendMessage(TOPICS.TURNO_RAPIDO, turnoActual);

  // 7.1 Devuelve el resultado al frontend
  res.status(200).json({
    acertada: !!respuestaCorrecta,
    esMasFamosa,
    turno: turnoActual,
    mensaje,
    respuestasAcertadas: respuestasAcertadasTextos,
  });
}

/**
 * Función auxiliar para limpiar el tablero y el turno al finalizar la ronda.
 * Reinicia strikes, turno, modo robo y elimina respuestas acertadas en la BD.
 */
export async function resetTableroYTurno(rondaId) {
  await db.query(
    `UPDATE Rondas SET 
      turno_actual = NULL, 
      strikes_jugadorA = 0, 
      strikes_jugadorB = 0, 
      puede_robar = 0, 
      robando = NULL, 
      puntos_acumulados = 0
    WHERE ronda_id = ?`, 
    [rondaId]
  );
  await db.query(
    "DELETE FROM Respuestas_Acertadas WHERE ronda_id = ?",
    [rondaId]
  );
}