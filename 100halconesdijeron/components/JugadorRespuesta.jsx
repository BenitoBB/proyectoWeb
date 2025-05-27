//components/JugadorRespuesta.jsx

'use client';

import { useState } from 'react';
import { useMQTT } from '@/utils/mqttClient';
import { TOPICS } from '@/utils/constants';

export default function JugadorRespuesta({ nombre, rol, turno }) {
  const [respuesta, setRespuesta] = useState('');
  const [enviada, setEnviada] = useState(false);
  const { sendMessage } = useMQTT(TOPICS.RESULTADO_VALIDACION); // Escuchamos resultados del admin

  const handleEnviar = () => {
    if (respuesta.trim()) {
      const payload = {
        jugador: nombre,
        respuesta: respuesta.trim()
      };

      sendMessage(TOPICS.RESPUESTA_JUGADOR, JSON.stringify(payload));
      setEnviada(true);
      setRespuesta('');
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <input
        type="text"
        value={respuesta}
        onChange={(e) => setRespuesta(e.target.value)}
        placeholder="Tu respuesta"
        disabled={enviada || turno !== rol}
        style={{ padding: '0.5rem', marginRight: '1rem' }}
      />
      <button onClick={handleEnviar} disabled={enviada}>
        Enviar
      </button>
    </div>
  );
}
