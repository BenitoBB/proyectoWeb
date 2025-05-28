import db from '@/lib/db';

export default async function handler(req, res) {
  const [preguntas] = await db.query('SELECT * FROM preguntas');

  const resultados = [];

  for (const pregunta of preguntas) {
    const [respuestas] = await db.query('SELECT * FROM respuestas WHERE pregunta_id = ?', [pregunta.id]);

    for (const respuesta of respuestas) {
      const [sinonimos] = await db.query('SELECT texto FROM sinonimos WHERE respuesta_id = ?', [respuesta.id]);
      respuesta.sinonimos = sinonimos.map(s => s.texto);
    }

    resultados.push({
      id: pregunta.id,
      texto: pregunta.texto,
      respuestas
    });
  }

  res.status(200).json(resultados);
}
