'use client';

import { useState } from 'react';
import { useMQTT } from '@/utils/mqttClient';
import { TOPICS } from '@/utils/constants';

export default function MesaRapidezAdmin({ pregunta }) {
  const [ganador, setGanador] = useState(null);

  useMQTT(TOPICS.RAPIDEZ_BOTON, (payload) => {
    const data = JSON.parse(payload);
    setGanador(data.rol);
  });

  return (
    <div className="text-center p-4 border border-gray-300 rounded mt-4">
      <h2 className="text-lg font-bold">⚡ Mesa de rapidez</h2>
      <p>Pregunta actual: {pregunta}</p>
      <p className="mt-2">Ganador: <strong>{ganador ? ganador : 'Esperando resultado...'}</strong></p>
    </div>
  );
}