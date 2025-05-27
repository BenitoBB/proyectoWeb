import { TOPICS } from '@/utils/constants';
import { initMQTTClient, mqttSendMessage } from '@/utils/mqttClient';

let primerJugador = null;

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  initMQTTClient();
  const { jugador } = req.body;

  if (!primerJugador) {
    primerJugador = jugador;
    // Aquí deberías actualizar el estado del juego/ronda en tu base de datos
    mqttSendMessage(TOPICS.ESTADO_TABLERO, JSON.stringify({
      // ...otros campos del tablero...
      turno: jugador,
      fase: 'respondiendo'
    }));
  }

  res.status(200).json({ primero: primerJugador });
}