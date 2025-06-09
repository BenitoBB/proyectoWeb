import db from "@/lib/db";

export default async function handler(req, res) {
  try {
    // Total de juegos
    const [[{ totalJuegos }]] = await db.query("SELECT COUNT(*) AS totalJuegos FROM Partidas");

    // Total de rondas
    const [[{ totalRondas }]] = await db.query("SELECT COUNT(*) AS totalRondas FROM Rondas");

    // Pregunta más jugada
    const [[{ texto_pregunta: preguntaMasJugada }]] = await db.query(`
      SELECT P.texto_pregunta, COUNT(*) as veces 
      FROM Rondas R 
      JOIN Preguntas P ON R.pregunta_id = P.pregunta_id 
      GROUP BY R.pregunta_id 
      ORDER BY veces DESC LIMIT 1
    `);

    // Respuesta con más puntaje
    const [[{ texto_respuesta: respuestaMasPuntaje }]] = await db.query(`
      SELECT texto_respuesta 
      FROM Respuestas 
      ORDER BY puntaje DESC LIMIT 1
    `);

    // Respuesta más popular (más veces acertada)
    const [[{ texto_respuesta: respuestaMasPopular }]] = await db.query(`
      SELECT R.texto_respuesta, COUNT(*) as veces
      FROM Respuestas_Acertadas RA
      JOIN Respuestas R ON RA.respuesta_id = R.respuesta_id
      GROUP BY RA.respuesta_id
      ORDER BY veces DESC LIMIT 1
    `);

    // Promedio de respuestas acertadas por ronda
    const [[{ promedio }]] = await db.query(`
      SELECT AVG(cnt) as promedio
      FROM (
        SELECT COUNT(*) as cnt
        FROM Respuestas_Acertadas
        GROUP BY ronda_id
      ) t
    `);

    res.status(200).json({
      totalJuegos,
      totalRondas,
      preguntaMasJugada: preguntaMasJugada || "N/A",
      respuestaMasPuntaje: respuestaMasPuntaje || "N/A",
      respuestaMasPopular: respuestaMasPopular || "N/A",
      promedioRespuestasPorRonda: promedio ? Number(promedio).toFixed(2) : "N/A"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}