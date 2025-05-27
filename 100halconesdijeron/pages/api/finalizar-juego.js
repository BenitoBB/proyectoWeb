//api/finalizar-juego.js

import fs from 'fs';
import path from 'path';

const GAMES_FILE = path.join(process.cwd(), 'data', 'games.json');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ mensaje: 'Método no permitido' });
  }

  const content = fs.readFileSync(GAMES_FILE, 'utf8');
  const juegos = JSON.parse(content);

  const juegoActivo = juegos.find(j => !j.finalizado);
  if (!juegoActivo) {
    return res.status(404).json({ mensaje: 'No hay juego activo' });
  }

  juegoActivo.finalizado = true;

  fs.writeFileSync(GAMES_FILE, JSON.stringify(juegos, null, 2), 'utf8');

  return res.status(200).json({ mensaje: 'Juego finalizado correctamente', puntaje: juegoActivo.puntaje });
}
