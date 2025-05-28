//components/JugadorRespuesta.jsx

'use client';

import { useEffect, useState } from 'react';
import { useMQTT } from '@/utils/mqttClient';
import { TOPICS } from '@/utils/constants';

export default function JugadorRespuesta({ nombre, rol }) {
  const [respuesta, setRespuesta] = useState('');
  const [habilitado, setHabilitado] = useState(false);

  const { sendMessage } = useMQTT(TOPICS.RESPUESTA_JUGADOR);

  // Escuchar quién ganó la mesa rapidez
  useMQTT(TOPICS.RAPIDEZ_BOTON, (payload) => {
    const data = JSON.parse(payload);
    setHabilitado(data.rol === rol);
  });

  const enviar = () => {
    if (!respuesta.trim() || !habilitado) return;
    sendMessage(TOPICS.RESPUESTA_JUGADOR, JSON.stringify({
      jugador: nombre,
      respuesta: respuesta.trim()
    }));
    setRespuesta('');
  };

  return (
    <div className="mt-4">
      <h3 className="mb-2">Tu respuesta</h3>
      <input
        type="text"
        value={respuesta}
        disabled={!habilitado}
        onChange={(e) => setRespuesta(e.target.value)}
        className="border p-2 rounded w-64 mr-2"
      />
      <button
        onClick={enviar}
        disabled={!habilitado}
        className={`px-4 py-2 text-white rounded ${habilitado ? 'bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        Enviar
      </button>
    </div>
  );
}
