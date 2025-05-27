//components/JuegoFinalizado.jsx

'use client';

import { useMQTT } from '@/utils/mqttClient';
import { TOPICS } from '@/utils/constants';

export default function JuegoFinalizado({ puntaje, esAdmin = false }) {
  const { sendMessage } = useMQTT();

  const handleNuevoJuego = () => {
    fetch('/api/nuevo-juego', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        sendMessage(TOPICS.NUEVO_JUEGO, JSON.stringify(data.nuevoJuego));
        location.reload(); // O usa router.push('/admin') si prefieres
      });
  };

  let ganador = '';
  if (puntaje.jugadorA > puntaje.jugadorB) ganador = 'Familia A';
  else if (puntaje.jugadorB > puntaje.jugadorA) ganador = 'Familia B';
  else ganador = 'Empate';

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>🏁 ¡Juego Finalizado!</h2>
      <p>Ganador: <strong>{ganador}</strong></p>
      <p>Puntajes:</p>
      <p>Familia A: {puntaje.jugadorA}</p>
      <p>Familia B: {puntaje.jugadorB}</p>
      {esAdmin && (
        <button onClick={handleNuevoJuego} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Iniciar nuevo juego
        </button>
      )}
    </div>
  );
}
