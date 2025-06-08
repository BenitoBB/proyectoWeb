import db from "@/lib/db";
import { mqttSendMessage } from "@/utils/serverMqtt";
import { TOPICS } from "@/utils/constants";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { jugador, rondaId } = req.body;
  if (!jugador || !rondaId) return res.status(400).json({ error: "Faltan datos" });

  // Leer el estado actual de la ronda
  const [[ronda]] = await db.query(
    "SELECT turno_actual FROM Rondas WHERE ronda_id = ?",
    [rondaId]
  );

  if (!ronda) return res.status(404).json({ error: "Ronda no encontrada" });

  if (!ronda.turno_actual) {
    // El primero en presionar el botón se guarda como turno_actual
    await db.query(
      "UPDATE Rondas SET turno_actual = ? WHERE ronda_id = ?",
      [jugador, rondaId]
    );
    mqttSendMessage(TOPICS.TURNO_RAPIDO, jugador);
    return res.status(200).json({ ganador: jugador });
  } else {
    const nuevoTurno = jugador === "Jugador A" ? "Jugador B" : "Jugador A";
    return res.status(200).json({ ganador: nuevoTurno });
  }
}