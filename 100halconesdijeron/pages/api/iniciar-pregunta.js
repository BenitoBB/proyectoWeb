import db from '@/lib/db';
import { mqttSendMessage } from '@/utils/mqttClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { preguntaId } = req.body;

  const [preguntas] = await db.query('SELECT * FROM preguntas WHERE id = ?', [preguntaId]);
  if (preguntas.length === 0) return res.status(404).json({ error: 'Pregunta no encontrada' });

  const [respuestas] = await db.query('SELECT * FROM respuestas WHERE pregunta_id = ?', [preguntaId]);

  for (const respuesta of respuestas) {
    const [sinonimos] = await db.query('SELECT texto FROM sinonimos WHERE respuesta_id = ?', [respuesta.id]);
    respuesta.sinonimos = sinonimos.map(s => s.texto);
  }

  const data = {
    pregunta: preguntas[0].texto,
    respuestas_validas: respuestas,
    respuestas_acertadas: [],
    strikes: 0,
    finalizada: false,
    turno: null // se asigna tras la MesaRapidez
  };

  mqttSendMessage('halcones/juego/seleccionada', JSON.stringify(data));

  res.status(200).json({ mensaje: 'Pregunta enviada correctamente', data });
}