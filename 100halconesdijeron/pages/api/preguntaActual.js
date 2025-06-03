import db from "@/lib/db";

export default async function handler(req, res) {
  try {
    // Obtener una pregunta aleatoria activa
    const [preguntas] = await db.query(
      "SELECT * FROM Preguntas WHERE activa = 1 ORDER BY RAND() LIMIT 1"
    );
    if (preguntas.length === 0) {
      return res.status(404).json({ error: "No hay preguntas activas" });
    }
    const pregunta = preguntas[0];

    // Obtener respuestas principales de la pregunta
    const [respuestas] = await db.query(
      "SELECT * FROM Respuestas WHERE pregunta_id = ? ORDER BY puntaje DESC",
      [pregunta.pregunta_id]
    );

    res.status(200).json({
      pregunta: {
        id: pregunta.pregunta_id,
        texto: pregunta.texto_pregunta,
        respuestas,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}