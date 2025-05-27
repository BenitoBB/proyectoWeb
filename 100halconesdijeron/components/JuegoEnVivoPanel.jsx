//components/JuegoEnVivoPanel.jsx
'use client';

import { useEffect, useState } from 'react';
import { TOPICS } from '@/utils/constants';
import { useMQTT } from '@/utils/mqttClient';

export default function JuegoEnVivoPanel() {
  const [juego, setJuego] = useState(null);
  const [ronda, setRonda] = useState(null);
  const { sendMessage } = useMQTT(TOPICS.RESPUESTA_JUGADOR, handleRespuestaJugador);

  // Manejar respuestas entrantes desde jugadores
  function handleRespuestaJugador(payload) {
    const data = JSON.parse(payload);

    // Validar vía API
    fetch('/api/validar-respuesta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(resultado => {
        // Publicar resultado a todos
        sendMessage(TOPICS.RESULTADO_VALIDACION, JSON.stringify(resultado));

        // Actualizar tablero
        fetch('/api/games')
          .then(res => res.json())
          .then(juegos => {
            const juegoActivo = juegos.find(j => !j.finalizado);
            if (!juegoActivo) return;
            const ronda = juegoActivo.rondas[juegoActivo.rondas.length - 1];

            const tablero = {
              respuestas_acertadas: ronda.respuestas_acertadas,
              strikes: ronda.strikes,
              turno: ronda.turno
            };

            sendMessage(TOPICS.ESTADO_TABLERO, JSON.stringify(tablero));
          });
      });
  }

  // Cargar datos iniciales
  useEffect(() => {
    fetch('/api/games')
      .then((res) => res.json())
      .then((data) => {
        const actual = data.find(j => !j.finalizado);
        if (actual) {
          setJuego(actual);
          setRonda(actual.rondas[actual.rondas.length - 1]);
        }
      });
  }, []);

  // Función para pasar a una nueva ronda
  const handleNuevaRonda = () => {
    const pregunta = "¿Qué haces en tu cumpleaños?";
    const respuestas_validas = [
      {
        texto: "Comer pastel",
        puntos: 40,
        sinonimos: ["pastel", "tarta", "pastelito"]
      },
      {
        texto: "Recibir regalos",
        puntos: 30,
        sinonimos: ["regalos", "sorpresas"]
      },
      {
        texto: "Festejar",
        puntos: 20,
        sinonimos: ["celebrar", "hacer fiesta"]
      }
    ];

    fetch('/api/nueva-ronda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta, respuestas_validas })
    })
      .then(res => res.json())
      .then(data => {
        // Publicar mensaje de nueva ronda por MQTT
        sendMessage(TOPICS.NUEVA_RONDA, JSON.stringify({ mensaje: 'nueva ronda creada' }));

        // Recargar datos
        setJuego(prev => ({
          ...prev,
          rondas: [...prev.rondas, data.nuevaRonda]
        }));
        setRonda(data.nuevaRonda);
      });
  };

  if (!juego || !ronda) return <p>Cargando juego en vivo...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Juego actual: {juego.id}</h2>
      <h3>Pregunta: {ronda.pregunta}</h3>
      <p>Turno actual: <strong>{ronda.turno}</strong></p>

      <div style={{ marginTop: '1rem' }}>
        <h4>Tablero de respuestas:</h4>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          {ronda.respuestas_validas.map((resp, index) => {
            const acertada = ronda.respuestas_acertadas.includes(resp.texto.toLowerCase());
            return (
              <div
                key={index}
                style={{
                  border: '2px solid #ccc',
                  padding: '1rem',
                  minWidth: '120px',
                  textAlign: 'center',
                  backgroundColor: acertada ? '#d4edda' : '#f8f9fa'
                }}
              >
                {acertada ? (
                  <>
                    <p><strong>{resp.texto}</strong></p>
                    <p>{resp.puntos} pts</p>
                  </>
                ) : (
                  <p>???</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p>Strikes: {"❌".repeat(ronda.strikes)}</p>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <button onClick={handleNuevaRonda} style={boton}>
          Siguiente Ronda
        </button>
        <button style={{ ...boton, backgroundColor: '#dc3545' }} onClick={() => alert("Finalizar juego")}>
          Finalizar Juego
        </button>
      </div>
    </div>
  );
}

const boton = {
  marginRight: '1rem',
  padding: '0.5rem 1rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};
