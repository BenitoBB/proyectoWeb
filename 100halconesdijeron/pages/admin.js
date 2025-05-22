// ------------------------------
// 📁 pages/admin.js
// Vista del administrador, donde puede ver el puntaje y pasar a la siguiente ronda.
// ------------------------------
import { useMQTT } from '../utils/mqttClient';
import { useEffect, useState } from 'react';

export default function Admin() {
  const [eventos, setEventos] = useState([]);
  const [puntajes, setPuntajes] = useState({});

  // Escuchar eventos del juego
  useMQTT('game/events', (message) => {
    const data = JSON.parse(message.payloadString);
    setEventos((prev) => [...prev, data]);
    if (data.type === 'respuesta_correcta' || data.type === 'respuesta_incorrecta') {
      setPuntajes(prev => ({ ...prev, [data.player]: data.total }));
    }
  });

  // Función para pasar de ronda (llama al backend)
  const pasarDeRonda = async () => {
    await fetch('/api/game', { method: 'PUT' });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Panel del Administrador</h1>
      <h3>Puntajes:</h3>
      <ul>
        {Object.entries(puntajes).map(([jugador, puntos]) => (
          <li key={jugador}>{jugador}: {puntos} puntos</li>
        ))}
      </ul>
      <h3>Eventos recientes:</h3>
      <ul>
        {eventos.map((ev, idx) => (
          <li key={idx}>{JSON.stringify(ev)}</li>
        ))}
      </ul>
      <button onClick={pasarDeRonda}>Pasar de ronda</button>
    </div>
  );
}