//components/PuntajePanel.jsx

'use client';

import { useState } from 'react';
import { useMQTT } from '@/utils/mqttClient';
import { TOPICS } from '@/utils/constants';

export default function PuntajePanel() {
  const [puntaje, setPuntaje] = useState({
    jugadorA: 0,
    jugadorB: 0
  });

  useMQTT(TOPICS.PUNTAJE, (payload) => {
    const data = JSON.parse(payload);
    setPuntaje(data);
  });

  return (
    <div style={{ marginTop: '1rem' }}>
      <h4>Puntajes:</h4>
      <p>Familia A: <strong>{puntaje.jugadorA}</strong></p>
      <p>Familia B: <strong>{puntaje.jugadorB}</strong></p>
    </div>
  );
}
// Este componente muestra el puntaje de los jugadores en tiempo real