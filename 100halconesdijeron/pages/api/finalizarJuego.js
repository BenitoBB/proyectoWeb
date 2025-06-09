import db from "@/lib/db";
import { mqttSendMessage } from "@/utils/serverMqtt";
import { TOPICS } from "@/utils/constants";

export default async function handler(req, res) {
  try {
    // Obtener la ronda actual (puedes ajustar esto según tu lógica)
    const [[ronda]] = await db.query(
      "SELECT * FROM Rondas ORDER BY ronda_id DESC LIMIT 1"
    );
    if (!ronda) return res.status(404).json({ error: "No hay ronda activa" });

    // Obtener todas las respuestas de la pregunta actual
    const [respuestas] = await db.query(
      "SELECT * FROM Respuestas WHERE pregunta_id = ? ORDER BY puntaje DESC",
      [ronda.pregunta_id]
    );
    const respuestasAcertadasTextos = respuestas.map(r => r.texto_respuesta);

    // Publicar todas las respuestas como acertadas
    mqttSendMessage(TOPICS.ESTADO_TABLERO, JSON.stringify({
      respuestasAcertadas: respuestasAcertadasTextos,
      strikesA: ronda.strikes_jugadorA,
      strikesB: ronda.strikes_jugadorB,
      puedeRobar: false,
      robando: null,
    }));

    // Publicar ganador vacío o mensaje de finalización
    mqttSendMessage(TOPICS.GANADOR, "Juego finalizado");

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}