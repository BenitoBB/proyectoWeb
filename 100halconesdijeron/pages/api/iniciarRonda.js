import db from "@/lib/db";
import { mqttSendMessage } from "@/utils/serverMqtt";
import { TOPICS } from "@/utils/constants";
import { resetTableroYTurno } from "./responder";

export default async function handler(req, res) {
  try {
    // 1. Obtener una pregunta aleatoria activa
    const [preguntas] = await db.query(
      "SELECT * FROM Preguntas WHERE activa = 1 ORDER BY RAND() LIMIT 1"
    );
    if (preguntas.length === 0) {
      return res.status(404).json({ error: "No hay preguntas activas" });
    }
    const pregunta = preguntas[0];

    // 2. Obtener respuestas principales de la pregunta
    const [respuestas] = await db.query(
      "SELECT * FROM Respuestas WHERE pregunta_id = ? ORDER BY puntaje DESC",
      [pregunta.pregunta_id]
    );

    // 3. Crear una nueva ronda en la BD
    const [result] = await db.query(
      "INSERT INTO Rondas (partida_id, pregunta_id, numero_ronda) VALUES (?, ?, ?)",
      [1, pregunta.pregunta_id, 1]
    );
    const rondaId = result.insertId;

    // 4. Limpiar el estado de la ronda (strikes, turno, modo robo, respuestas acertadas)
    await resetTableroYTurno(rondaId);

    // 5. Publicar por MQTT el estado inicial
    mqttSendMessage(
      TOPICS.PREGUNTA_ACTUAL,
      JSON.stringify({
        pregunta: {
          id: pregunta.pregunta_id,
          texto: pregunta.texto_pregunta,
        },
        respuestas,
        rondaId,
      })
    );

    // Limpiar el ganador en el frontend
    mqttSendMessage(TOPICS.GANADOR, "");

    // Publicar tablero limpio
    mqttSendMessage(
      TOPICS.ESTADO_TABLERO,
      JSON.stringify({
        respuestasAcertadas: [],
        strikesA: 0,
        strikesB: 0,
        puedeRobar: false,
        robando: null,
      })
    );

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}