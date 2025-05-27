//api/validar-respuesta.js

import path from 'path';
import fs from 'fs';
import { validarRespuesta } from '@/utils/validadorRespuestas';
import { mqttSendMessage } from '@/utils/serverMqtt';

const GAMES_FILE = path.join(process.cwd(), 'data', 'games.json');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ mensaje: 'Método no permitido' });
  }

  const { respuesta, jugador } = req.body;
  if (!respuesta || !jugador) {
    return res.status(400).json({ mensaje: 'Datos incompletos' });
  }

  const fileContent = fs.readFileSync(GAMES_FILE, 'utf8');
  const juegos = JSON.parse(fileContent);

  const juegoActivo = juegos.find(j => !j.finalizado);
  if (!juegoActivo) {
    return res.status(404).json({ mensaje: 'No hay juego activo' });
  }

  const rondaActual = juegoActivo.rondas[juegoActivo.rondas.length - 1];

  const validacion = validarRespuesta(
    respuesta,
    rondaActual.respuestas_validas,
    rondaActual.respuestas_acertadas
  );

  // Agregar puntaje si acertó
  if (validacion.acertada) {
    const rol = jugador.toLowerCase().includes('a') ? 'jugadorA' : 'jugadorB';
    if (!juegoActivo.puntaje) juegoActivo.puntaje = { jugadorA: 0, jugadorB: 0 };
    juegoActivo.puntaje[rol] += validacion.puntos;
    rondaActual.respuestas_acertadas.push(validacion.respuesta.toLowerCase());
  } else {
    rondaActual.strikes += 1;
  }

  // Guardar cambios
  fs.writeFileSync(GAMES_FILE, JSON.stringify(juegos, null, 2), 'utf8');

  // Publicar puntaje actualizado
  const puntajeActualizado = juegoActivo.puntaje;
  mqttSendMessage('halcones/juego/puntaje', JSON.stringify(puntajeActualizado));

  return res.status(200).json({
    jugador,
    resultado: validacion.acertada ? 'acierto' : 'fallo',
    respuesta: validacion.respuesta || null,
    puntos: validacion.puntos || 0,
    strikes: rondaActual.strikes
  });
}
