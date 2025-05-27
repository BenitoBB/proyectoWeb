'use client';

import { useState } from 'react';
import { useMQTT } from '@/utils/mqttClient';
import { TOPICS } from '@/utils/constants';

export default function MesaRapidez({ jugador }) {
  const [yaPresiono, setYaPresiono] = useState(false);
  const { sendMessage } = useMQTT(TOPICS.TURNO_RAPIDO, () => {});

  const presionarBoton = () => {
    setYaPresiono(true);
    sendMessage(TOPICS.TURNO_RAPIDO, JSON.stringify({ jugador }));
  };

  return (
    <div className="text-center mt-6">
      <h2 className="text-xl font-bold">¡Presiona para responder primero!</h2>
      <button
        disabled={yaPresiono}
        onClick={presionarBoton}
        className="mt-4 px-6 py-3 bg-red-600 text-white rounded text-lg"
      >
        {yaPresiono ? "Esperando resultado..." : "¡Responder!"}
      </button>
    </div>
  );
}
