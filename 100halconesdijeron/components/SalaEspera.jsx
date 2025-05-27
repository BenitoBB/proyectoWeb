//components/SalaEspera.jsx

'use client';

import { useEffect, useState } from 'react';
import { useMQTT } from '@/utils/mqttClient';

export default function SalaEspera({ rol, setListoGlobal }) {
  const [estado, setEstado] = useState({
    admin: false,
    jugadorA: false,
    jugadorB: false
  });

  const [listo, setListo] = useState(false);
  
  const { sendMessage } = useMQTT('halcones/sala/conectados', (payload) => {
    console.log('📨 Mensaje recibido en SalaEspera:', payload);
    const data = JSON.parse(payload);

    setEstado((prev) => {
      const nuevo = { ...prev, [data.rol]: data.conectado };
      console.log('🔁 Estado actualizado:', nuevo);
      return nuevo;
    });
  });

  useEffect(() => {
    console.log('🔁 Enviando estado conectado:', { rol, conectado: true });
    sendMessage('halcones/sala/conectados', JSON.stringify({ rol, conectado: true }));
  }, []);


  useEffect(() => {
    if (estado.admin && estado.jugadorA && estado.jugadorB) {
      setListo(true);
      if (setListoGlobal) setListoGlobal(true);
    }
  }, [estado]);


  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>{listo ? '✅ Todos conectados. ¡Listo para jugar!' : '⏳ Esperando a los demás jugadores...'}</h2>
      <div style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
        <p>Admin: {estado.admin ? '🟢 Conectado' : '🔴 Esperando'}</p>
        <p>Jugador A: {estado.jugadorA ? '🟢 Conectado' : '🔴 Esperando'}</p>
        <p>Jugador B: {estado.jugadorB ? '🟢 Conectado' : '🔴 Esperando'}</p>
      </div>
    </div>
  );
}
