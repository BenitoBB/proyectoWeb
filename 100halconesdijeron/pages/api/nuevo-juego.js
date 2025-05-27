import fs from 'fs';
import path from 'path';

const GAMES_FILE = path.join(process.cwd(), 'data', 'games.json');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ mensaje: 'Método no permitido' });
  }

  const fileContent = fs.readFileSync(GAMES_FILE, 'utf8');
  const juegos = JSON.parse(fileContent);

  const nuevoJuego = {
    id: `juego-${String(juegos.length + 1).padStart(3, '0')}`,
    fecha_inicio: new Date().toISOString(),
    finalizado: false,
    puntaje: { jugadorA: 0, jugadorB: 0 },
    rondas: []
  };

  juegos.push(nuevoJuego);
  fs.writeFileSync(GAMES_FILE, JSON.stringify(juegos, null, 2), 'utf8');

  return res.status(200).json({ mensaje: 'Nuevo juego creado', nuevoJuego });
}
