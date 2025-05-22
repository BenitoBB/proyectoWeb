/**
 * Registra jugadores en la base de datos.
 */

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Agregar jugador
    const { name } = req.body;
    // Simulación: en producción, guardar en DB
    res.status(200).json({ message: `Jugador ${name} registrado.` });
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}