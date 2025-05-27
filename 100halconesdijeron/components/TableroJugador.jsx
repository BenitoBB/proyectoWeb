//components/TableroJugador.jsx

'use client';

import { useState } from 'react';
import { useMQTT } from '@/utils/mqttClient';
import { TOPICS } from '@/utils/constants';

export default function TableroJugador() {
  const [tablero, setTablero] = useState({
    respuestas_acertadas: [],
    strikes: 0,
    turno: ''
  });

  useMQTT(TOPICS.ESTADO_TABLERO, (payload) => {
    const data = JSON.parse(payload);
    setTablero(data);
  });

  useMQTT(TOPICS.NUEVA_RONDA, () => {
    setTablero({
        respuestas_acertadas: [],
        strikes: 0,
        turno: ''
    });
});


  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Turno: {tablero.turno}</h3>
      <p>Strikes: {"❌".repeat(tablero.strikes)}</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {tablero.respuestas_acertadas.map((r, i) => (
          <div key={i} style={{
            border: '1px solid #ccc',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            backgroundColor: '#d4edda'
          }}>
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}
