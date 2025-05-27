//components/SalaEspera.jsx

'use client';

import { useEffect, useState } from 'react';
import { useMQTT, useMQTTClient } from '@/utils/mqttClient';

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
      const updated = { ...prev };
      if (data.rol in updated) {
        updated[data.rol] = data.conectado;
      }
      console.log('🔁 Estado actualizado:', updated);
      return updated;
    });
  });

  const client = useMQTTClient();

  useEffect(() => {
    console.log('🔁 Enviando estado conectado:', { rol, conectado: true });
    sendMessage('halcones/sala/conectados', JSON.stringify({ rol, conectado: true }));
  }, []);

  // Enviar el estado periódicamente cada 3 segundos mientras esperan
  useEffect(() => {
    const intervalo = setInterval(() => {
      if (typeof window !== 'undefined' && window.globalClient?.isConnected()) {
        sendMessage('halcones/sala/conectados', JSON.stringify({ rol, conectado: true }));
      }
    }, 3000);

    return () => clearInterval(intervalo);
  }, [rol, sendMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (client && client.isConnected && client.isConnected()) {
        console.log("✅ Enviando mensaje MQTT porque ya hay conexión");
        sendMessage('halcones/sala/conectados', JSON.stringify({ rol, conectado: true }));
        clearInterval(interval);
      } else {
        console.log("⏳ Esperando conexión MQTT...");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [client, rol, sendMessage]);
  

  useEffect(() => {
    if (estado.admin && estado.jugadorA && estado.jugadorB) {
      setListo(true);
      if (setListoGlobal) setListoGlobal(true);
    }
  }, [estado]);

  useEffect(() => {
    if (client && client.isConnected && client.isConnected()) {
      console.log("🔄 Reconectado MQTT, reenviando estado...");
      sendMessage('halcones/sala/conectados', JSON.stringify({ rol, conectado: true }));
    }
  }, [client, rol, sendMessage]);


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
