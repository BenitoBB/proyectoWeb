// ------------------------------
// 📁 pages/player.js
// Vista del jugador, donde puede ver su nombre y pulsar un botón para enviar respuestas.
// ------------------------------
import { useMQTT } from '../utils/mqttClient';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Player() {
  const router = useRouter();
  const { name } = router.query;
  const [mensaje, setMensaje] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [pregunta, setPregunta] = useState('');
  const [puntaje, setPuntaje] = useState(0);

  // Al montar, obtener el estado actual del juego
  useEffect(() => {
    if (!name) return;
    fetch('/api/game')
      .then(res => res.json())
      .then(data => {
        setPregunta(data.question);
        setPuntaje(data.players?.[name] || 0);
        setMensaje(`Ronda ${data.round}: ${data.question}`);
      });
  }, [name]);

  // Escuchar eventos del juego
  useMQTT('game/events', (message) => {
    const data = JSON.parse(message.payloadString);
    if (data.type === 'nueva_ronda') {
      setPregunta(data.question);
      setMensaje(`Ronda ${data.round}: ${data.question}`);
    }
    if (data.type === 'respuesta_correcta' && data.player === name) {
      setMensaje(`¡Correcto! Ganaste ${data.points} puntos. Total: ${data.total}`);
      setPuntaje(data.total);
    }
    if (data.type === 'respuesta_incorrecta' && data.player === name) {
      setMensaje('Respuesta incorrecta.');
    }
  });

  // Enviar respuesta al backend
  const enviarRespuesta = async () => {
    if (!respuesta) return;
    await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player: name, answer: respuesta })
    });
    setRespuesta('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Jugador: {name}</h2>
      <div>Puntaje: {puntaje}</div>
      <div>{mensaje}</div>
      {pregunta && (
        <div>
          <input
            type="text"
            value={respuesta}
            onChange={e => setRespuesta(e.target.value)}
            placeholder="Tu respuesta"
          />
          <button onClick={enviarRespuesta}>Enviar respuesta</button>
        </div>
      )}
    </div>
  );
}
