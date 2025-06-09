//components/SalaEspera.jsx

'use client';

// Importaciones necesarias
import { useEffect, useState } from 'react';
import { useMQTT, useMQTTClient } from '@/utils/mqttClient';
import { useRouter } from 'next/navigation'; // Asegúrate de importar esto

export default function SalaEspera({ rol, setListoGlobal }) {

  // Estado para manejar la conexión de los jugadores
  // Guarda el estado de conexión de cada rol
  // admin, jugadorA y jugadorB
  const [estado, setEstado] = useState({
    admin: false,
    jugadorA: false,
    jugadorB: false
  });

  // Estado para indicar si todos los jugadores están conectados
  // y listos para comenzar el juego
  const [listo, setListo] = useState(false);
  
  // Suscribirse al tópico MQTT para recibir actualizaciones
  //  sendMessage es una función que envía mensajes al tópico especificado
  const { sendMessage } = useMQTT('halcones/sala/conectados', (payload) => { // Tópico para recibir mensajes de conexión
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

  const client = useMQTTClient(); // Obtener el cliente MQTT actual
  // Envía mensaje al conectarse a la sala de espera
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
    }, 3000); // Cada 3 segundos

    return () => clearInterval(intervalo);
  }, [rol, sendMessage]);

  // Verificar la conexión MQTT cada 500 ms y enviar mensaje si está conectado
  useEffect(() => {
    const interval = setInterval(() => {
      if (client && client.isConnected && client.isConnected()) {
        console.log("✅ Enviando mensaje MQTT porque ya hay conexión");
        sendMessage('halcones/sala/conectados', JSON.stringify({ rol, conectado: true }));
        clearInterval(interval);
      } else {
        console.log("⏳ Esperando conexión MQTT...");
      }
    }, 500); // Cada 500 ms

    return () => clearInterval(interval);
  }, [client, rol, sendMessage]);
  
  // Verificar si todos los jugadores están conectados
  useEffect(() => {
    if (estado.admin && estado.jugadorA && estado.jugadorB) {
      setListo(true);
      if (setListoGlobal) setListoGlobal(true); // Actualizar el estado global si se proporciona
    }
  }, [estado]);

  // Reconectar y reenviar el estado si el cliente MQTT se reconecta
  useEffect(() => {
    if (client && client.isConnected && client.isConnected()) {
      console.log("🔄 Reconectado MQTT, reenviando estado...");
      sendMessage('halcones/sala/conectados', JSON.stringify({ rol, conectado: true }));
    }
  }, [client, rol, sendMessage]);

  const router = useRouter();

  useEffect(() => {
    if (listo) {
      if (rol === 'jugadorA' || rol === 'jugadorB') {
        router.push(`/jugador/indexMesa?rol=${rol}`);
      } else if (rol === 'admin') {
        router.push('/admin/indexAdmin?rol=admin');
      }
    }
  }, [listo, rol, router]);


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
