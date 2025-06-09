/**
 * Recibe la respuesta y el jugador.
 * Valida si la respuesta es la más famosa.
 * Publica el turno y el estado del tablero por MQTT.
 * Devuelve el resultado al frontend.
 */

import db from "@/lib/db";
import { mqttSendMessage } from "@/utils/serverMqtt";
import { TOPICS } from "@/utils/constants";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Si el body viene como string (por curl), parsea manualmente
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }

  const { jugador, respuesta, preguntaId, rondaId } = body;

  // 1. Leer el estado actual de la ronda
  const [[ronda]] = await db.query(
    "SELECT * FROM Rondas WHERE ronda_id = ?",
    [rondaId]
  );
  if (!ronda) return res.status(404).json({ error: "Ronda no encontrada" });

  // 2. Leer respuestas acertadas
  const [acertadasRows] = await db.query(
    "SELECT respuesta_id FROM Respuestas_Acertadas WHERE ronda_id = ?",
    [rondaId]
  );
  const respuestasAcertadas = acertadasRows.map(r => r.respuesta_id);

  // 3. Obtener respuestas válidas
  const [respuestas] = await db.query(
    "SELECT * FROM Respuestas WHERE pregunta_id = ? ORDER BY puntaje DESC",
    [preguntaId]
  );

  // Mapear IDs a textos:
  const respuestasAcertadasTextos = respuestas
    .filter(r => respuestasAcertadas.includes(r.respuesta_id))
    .map(r => r.texto_respuesta);

  // 4. Buscar si la respuesta es válida y no ha sido acertada antes
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

  let esMasFamosa = false;
  let mensaje = "";
  let turnoActual = ronda.turno_actual;

  // 5. Lógica de strikes y robo
  let strikesA = ronda.strikes_jugadorA;
  let strikesB = ronda.strikes_jugadorB;
  let puedeRobar = ronda.puede_robar;
  let robando = ronda.robando;

  // Solo procesa si el jugador es el que tiene el turno
  if (turnoActual && jugador !== turnoActual) {
    return res.status(200).json({
      acertada: false,
      esMasFamosa: false,
      turno: turnoActual,
      mensaje: "No es tu turno.",
      respuestasAcertadas: respuestasAcertadasTextos,
    });
  }

  // --- MODO ROBO ---
  if (puedeRobar && robando === jugador) {
    if (respuestaCorrecta) {
      mensaje = "¡Robaste los puntos!";
      // Aquí puedes sumar puntos al jugador que robó y finalizar la ronda
      // Resetear ronda, strikes, etc.
      // Ejemplo: await resetTableroYTurno(rondaId);
    } else {
      mensaje = "No lograste robar. Los puntos se quedan con el otro jugador.";
      // Aquí puedes finalizar la ronda y resetear strikes, etc.
      // Ejemplo: await resetTableroYTurno(rondaId);
    }
    // Aquí podrías resetear strikes y modo robo en la BD
    // await db.query("UPDATE Rondas SET puede_robar = 0, robando = NULL WHERE ronda_id = ?", [rondaId]);
  }
  // --- RESPUESTA CORRECTA ---
  else if (respuestaCorrecta) {
    // Registrar respuesta acertada en la BD
    if (!respuestasAcertadas.includes(respuestaCorrecta.respuesta_id)) {
      await db.query(
        "INSERT INTO Respuestas_Acertadas (ronda_id, respuesta_id) VALUES (?, ?)",
        [rondaId, respuestaCorrecta.respuesta_id]
      );
    }

    // Vuelve a consultar las respuestas acertadas
    const [acertadasRows] = await db.query(
      "SELECT respuesta_id FROM Respuestas_Acertadas WHERE ronda_id = ?",
      [rondaId]
    );
    const respuestasAcertadasIds = acertadasRows.map(r => r.respuesta_id);
    const respuestasAcertadasTextos = respuestas
      .filter(r => respuestasAcertadasIds.includes(r.respuesta_id))
      .map(r => r.texto_respuesta);

    // Publica el tablero actualizado por MQTT
    mqttSendMessage(TOPICS.ESTADO_TABLERO, JSON.stringify({
      respuestasAcertadas: respuestasAcertadasTextos,
      strikesA,
      strikesB,
      puedeRobar,
      robando,
    }));

    // --- AGREGA ESTO: PUBLICAR GANADOR SI YA SE ACERTARON TODAS LAS RESPUESTAS ---
    if (respuestasAcertadasIds.length === respuestas.length) {
      mqttSendMessage(TOPICS.GANADOR, jugador);
    }

    // ¿Es la más famosa? (mayor puntaje)
    const maxPuntaje = Math.max(...respuestas.map(r => r.puntaje));
    esMasFamosa = respuestaCorrecta.puntaje === maxPuntaje;

    // --- DUEL DE RAPIDEZ ---
    if (ronda.duelo_rapido === 1) {
      if (esMasFamosa) {
        // El primero acierta la más famosa, termina el duelo
        await db.query(
          "UPDATE Rondas SET duelo_rapido = 0 WHERE ronda_id = ?",
          [rondaId]
        );
        mensaje = "¡Correcto! Es la respuesta más famosa. Sigues jugando.";
      } else {
        // El turno NO cambia, solo termina el duelo rápido
        await db.query(
          "UPDATE Rondas SET duelo_rapido = 0 WHERE ronda_id = ?",
          [rondaId]
        );
        mensaje = "¡Correcto! Sigues jugando.";
      }
    } else {
      // --- FLUJO NORMAL DESPUÉS DEL DUELO ---
      // SIEMPRE que acierte, sigue jugando, no importa si es la más famosa o no
      mensaje = esMasFamosa
        ? "¡Correcto! Es la respuesta más famosa. Sigues jugando."
        : "¡Correcto! Sigues jugando.";
      // NO cambies el turno aquí
    }
  }
  // --- RESPUESTA INCORRECTA ---
  else {
    // Suma strike
    if (jugador === "Jugador A") strikesA++;
    else strikesB++;

    // Nunca más de 2 strikes
    if (strikesA > 2) strikesA = 2;
    if (strikesB > 2) strikesB = 2;

    // Actualiza strikes en la BD
    await db.query(
      "UPDATE Rondas SET strikes_jugadorA = ?, strikes_jugadorB = ? WHERE ronda_id = ?",
      [strikesA, strikesB, rondaId]
    );

    // Si llega a 2 strikes, activa modo robo y cambia el turno
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
      // El turno NO cambia, el mismo jugador sigue intentando hasta 2 strikes
    }
  }

  // Publicar el turno por MQTT (esto sí puede ir siempre)
  mqttSendMessage(TOPICS.TURNO_RAPIDO, turnoActual);

  res.status(200).json({
    acertada: !!respuestaCorrecta,
    esMasFamosa,
    turno: turnoActual,
    mensaje,
    respuestasAcertadas: respuestasAcertadasTextos,
  });
}

export async function resetTableroYTurno(rondaId) {
  // Limpia los strikes, turno, modo robo y respuestas acertadas en la BD
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

