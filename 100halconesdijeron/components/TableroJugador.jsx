//components/TableroJugador.jsx
'use client';

import { useEffect, useState } from 'react';
import { useMQTT } from '@/utils/mqttClient';
import { TOPICS } from '@/utils/constants';

export default function TableroJugador() {
  const [tablero, setTablero] = useState({
    pregunta: '',
    turno: '',
    respuestas_validas: [],
    respuestas_acertadas: [],
    strikes: 0
  });

  // Recuperar tablero por MQTT
  useMQTT(TOPICS.ESTADO_TABLERO, (payload) => {
    const data = JSON.parse(payload);
    console.log('📥 Tablero recibido:', data);
    setTablero(data);
  });

  // Recuperar pregunta desde la API si no hay pregunta aún
  useEffect(() => {
    if (!tablero.pregunta) {
      fetch('/api/games')
        .then(res => res.json())
        .then(juegos => {
          const juegoActivo = juegos.find(j => !j.finalizado);
          if (juegoActivo) {
            const ronda = juegoActivo.rondas[juegoActivo.rondas.length - 1];
            setTablero(prev => ({
              ...prev,
              pregunta: ronda.pregunta || '',
              turno: ronda.turno || '',
              respuestas_validas: ronda.respuestas_validas || [],
              respuestas_acertadas: ronda.respuestas_acertadas || [],
              strikes: ronda.strikes || 0
            }));
          }
        });
    }
  }, [tablero.pregunta]);

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Pregunta: {tablero.pregunta || '...'}</h2>
      <p>Turno actual: <strong>{tablero.turno}</strong></p>

      <div className="mt-4">
        <h3 className="font-medium">Respuestas:</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {tablero.respuestas_validas.map((resp, index) => {
            const acertada = tablero.respuestas_acertadas.some(acertada =>
              acertada.trim().toLowerCase() === resp.texto.trim().toLowerCase()
            );

            return (
              <div
                key={index}
                className={`p-2 border rounded text-center min-w-[120px] ${
                  acertada ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-300'
                }`}
              >
                {acertada ? (
                  <>
                    <p className="font-bold">{resp.texto}</p>
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

      <div className="mt-4">
        <p>Strikes: {'❌'.repeat(tablero.strikes)}</p>
      </div>
    </div>
  );
}
