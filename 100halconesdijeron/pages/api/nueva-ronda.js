//api/nueva-ronda.js

import fs from 'fs';
import path from 'path';

const GAMES_FILE = path.join(process.cwd(), 'data', 'games.json');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ mensaje: 'Método no permitido' });
  }

  const { pregunta, respuestas_validas } = req.body;

  if (!pregunta || !respuestas_validas) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  const fileContent = fs.readFileSync(GAMES_FILE, 'utf8');
  const juegos = JSON.parse(fileContent);

  const juegoActivo = juegos.find(j => !j.finalizado);
  if (!juegoActivo) return res.status(404).json({ mensaje: 'No hay juego activo' });

  const nuevaRonda = {
    numero: juegoActivo.rondas.length + 1,
    pregunta,
    respuestas_validas,
    respuestas_acertadas: [],
    strikes: 0,
    finalizada: false,
    turno: 'Jugador 1'
  };

  juegoActivo.rondas.push(nuevaRonda);

  fs.writeFileSync(GAMES_FILE, JSON.stringify(juegos, null, 2), 'utf8');

  return res.status(200).json({ mensaje: 'Ronda creada correctamente', nuevaRonda });
}
