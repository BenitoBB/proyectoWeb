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

  console.log("BODY:", body);
  console.log("rondaId recibido:", rondaId);

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

  // Solo procesa si el jugador es el que tiene el turno
  if (turnoActual && jugador !== turnoActual) {
    return res.status(200).json({
      acertada: false,
      esMasFamosa: false,
      turno: turnoActual,
      mensaje: "No es tu turno.",
      respuestasAcertadas: respuestasAcertadasTextos,
    });
  } else if (respuestaCorrecta) {
    // Registrar respuesta acertada en la BD
    await db.query(
      "INSERT INTO Respuestas_Acertadas (ronda_id, respuesta_id) VALUES (?, ?)",
      [rondaId, respuestaCorrecta.respuesta_id]
    );
    respuestasAcertadas.push(respuestaCorrecta.respuesta_id);

    // ¿Es la más famosa? (mayor puntaje)
    const maxPuntaje = Math.max(...respuestas.map(r => r.puntaje));
    esMasFamosa = respuestaCorrecta.puntaje === maxPuntaje;

    // --- DUEL DE RAPIDEZ ---
    // Si la ronda está en duelo rápido (puedes usar un campo extra en la BD o lógica de frontend)
    if (ronda.duelo_rapido === 1) {
      // Aquí deberías guardar en la BD quién fue el primer y segundo jugador, sus respuestas y puntajes
      // Por simplicidad, vamos a asumir que el primer jugador ya está en turno_actual
      if (esMasFamosa) {
        // El primero acierta la más famosa, termina el duelo
        await db.query(
          "UPDATE Rondas SET duelo_rapido = 0 WHERE ronda_id = ?",
          [rondaId]
        );
        mensaje = "¡Correcto! Es la respuesta más famosa. Sigues jugando.";
      } else {
        // Cambia el turno al otro jugador para que intente superar la respuesta
        const nuevoTurno = jugador === "Jugador A" ? "Jugador B" : "Jugador A";
        await db.query(
          "UPDATE Rondas SET turno_actual = ? WHERE ronda_id = ?",
          [nuevoTurno, rondaId]
        );
        mensaje = "¡Correcto! Pero no es la más famosa. Turno para el otro jugador.";
      }
    } else {
      // --- FLUJO NORMAL DESPUÉS DEL DUELO ---
      if (esMasFamosa) {
        // Mantiene el turno
        mensaje = "¡Correcto! Es la respuesta más famosa. Sigues jugando.";
      } else {
        // Cambia el turno al otro jugador
        const nuevoTurno = jugador === "Jugador A" ? "Jugador B" : "Jugador A";
        await db.query(
          "UPDATE Rondas SET turno_actual = ? WHERE ronda_id = ?",
          [nuevoTurno, rondaId]
        );
        turnoActual = nuevoTurno;
        mensaje = "¡Correcto! Pero no es la más famosa. Turno para el otro jugador.";
      }
    }
  } else {
    // Respuesta incorrecta o repetida
    const nuevoTurno = jugador === "Jugador A" ? "Jugador B" : "Jugador A";
    await db.query(
      "UPDATE Rondas SET turno_actual = ? WHERE ronda_id = ?",
      [nuevoTurno, rondaId]
    );
    turnoActual = nuevoTurno;
    mensaje = "Respuesta incorrecta o ya fue respondida. Turno para el otro jugador.";
  }

  // 5. Lógica de strikes y robo
  let strikesA = ronda.strikes_jugadorA;
  let strikesB = ronda.strikes_jugadorB;
  let puedeRobar = ronda.puede_robar;
  let robando = ronda.robando;
  let puntosAcumulados = ronda.puntos_acumulados || 0;

  if (puedeRobar && robando === jugador) {
    // Modo robo
    if (respuestaCorrecta) {
      mensaje = "¡Robaste los puntos!";
      // Aquí puedes sumar puntos al jugador que robó
      // Reinicia la ronda o pasa a la siguiente
    } else {
      mensaje = "No lograste robar. Los puntos se quedan con el otro jugador.";
      // Reinicia la ronda o pasa a la siguiente
    }
    // Aquí podrías resetear strikes y modo robo en la BD
  } else if (respuestaCorrecta) {
    // Respuesta correcta
    await db.query(
      "INSERT INTO Respuestas_Acertadas (ronda_id, respuesta_id) VALUES (?, ?)",
      [rondaId, respuestaCorrecta.respuesta_id]
    );
    puntosAcumulados += respuestaCorrecta.puntaje;

    // ¿Es la más famosa? (mayor puntaje)
    const maxPuntaje = Math.max(...respuestas.map(r => r.puntaje));
    esMasFamosa = respuestaCorrecta.puntaje === maxPuntaje;

    // --- DUEL DE RAPIDEZ ---
    // Si la ronda está en duelo rápido (puedes usar un campo extra en la BD o lógica de frontend)
    if (ronda.duelo_rapido === 1) {
      // Aquí deberías guardar en la BD quién fue el primer y segundo jugador, sus respuestas y puntajes
      // Por simplicidad, vamos a asumir que el primer jugador ya está en turno_actual
      if (esMasFamosa) {
        // El primero acierta la más famosa, termina el duelo
        await db.query(
          "UPDATE Rondas SET duelo_rapido = 0 WHERE ronda_id = ?",
          [rondaId]
        );
        mensaje = "¡Correcto! Es la respuesta más famosa. Sigues jugando.";
      } else {
        // Cambia el turno al otro jugador para que intente superar la respuesta
        const nuevoTurno = jugador === "Jugador A" ? "Jugador B" : "Jugador A";
        await db.query(
          "UPDATE Rondas SET turno_actual = ? WHERE ronda_id = ?",
          [nuevoTurno, rondaId]
        );
        mensaje = "¡Correcto! Pero no es la más famosa. Turno para el otro jugador.";
      }
    } else {
      // --- FLUJO NORMAL DESPUÉS DEL DUELO ---
      if (esMasFamosa) {
        // Mantiene el turno
        mensaje = "¡Correcto! Es la respuesta más famosa. Sigues jugando.";
      } else {
        // Cambia el turno al otro jugador
        const nuevoTurno = jugador === "Jugador A" ? "Jugador B" : "Jugador A";
        await db.query(
          "UPDATE Rondas SET turno_actual = ? WHERE ronda_id = ?",
          [nuevoTurno, rondaId]
        );
        turnoActual = nuevoTurno;
        mensaje = "¡Correcto! Pero no es la más famosa. Turno para el otro jugador.";
      }
    }
  } else {
    // Respuesta incorrecta
    if (jugador === "Jugador A") strikesA++;
    else strikesB++;
 
    // Actualiza strikes en la BD
    await db.query(
      "UPDATE Rondas SET strikes_jugadorA = ?, strikes_jugadorB = ? WHERE ronda_id = ?",
      [strikesA, strikesB, rondaId]
    );

    // Si el jugador llega a 2 strikes, activa el modo robo
    if ((jugador === "Jugador A" && strikesA >= 2) || (jugador === "Jugador B" && strikesB >= 2)) {
      puedeRobar = true;
      robando = jugador === "Jugador A" ? "Jugador B" : "Jugador A";
      await db.query(
        "UPDATE Rondas SET puede_robar = 1, robando = ? WHERE ronda_id = ?",
        [robando, rondaId]
      );
      mensaje = `¡2 strikes! El otro jugador puede intentar robar.`;
    } else {
      mensaje = `Strike ${jugador === "Jugador A" ? strikesA : strikesB}. Sigue intentando.`;
      // Cambia el turno al otro jugador
      const nuevoTurno = jugador === "Jugador A" ? "Jugador B" : "Jugador A";
      await db.query(
        "UPDATE Rondas SET turno_actual = ? WHERE ronda_id = ?",
        [nuevoTurno, rondaId]
      );
      turnoActual = nuevoTurno;
    }
  }

  // Publicar el turno y el tablero por MQTT
  mqttSendMessage(TOPICS.TURNO_RAPIDO, turnoActual);
  mqttSendMessage(TOPICS.ESTADO_TABLERO, JSON.stringify({
    respuestasAcertadas: respuestasAcertadasTextos,
    strikesA,
    strikesB,
    puedeRobar,
    robando,
  }));

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

