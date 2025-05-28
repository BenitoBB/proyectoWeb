'use client';

import { useEffect, useState } from 'react';
import { useMQTT } from '@/utils/mqttClient';
import { TOPICS } from '@/utils/constants';

export default function MesaRapidez({ pregunta, nombre, rol, setTurnoGanado }) {
  const [cuenta, setCuenta] = useState(3);
  const [yaPermitidoPresionar, setYaPermitidoPresionar] = useState(false);
  const [ganador, setGanador] = useState(null);

  const { sendMessage } = useMQTT(TOPICS.RAPIDEZ_BOTON, (payload) => {
    const data = JSON.parse(payload);
    if (!ganador) {
      setGanador(data.rol);
      setTurnoGanado(data.rol);
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCuenta((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setYaPermitidoPresionar(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePresionar = () => {
    if (!yaPermitidoPresionar || ganador) return;
    sendMessage(TOPICS.RAPIDEZ_BOTON, JSON.stringify({ nombre, rol }));
  };

  return (
    <div className="text-center p-6">
      <h2 className="text-2xl font-bold mb-4">¡Ronda de Velocidad!</h2>
      <p className="text-xl mb-2">Pregunta: {pregunta}</p>

      {!yaPermitidoPresionar && <p className="text-lg">Prepárate... {cuenta}</p>}

      {yaPermitidoPresionar && !ganador && (
        <button
          onClick={handlePresionar}
          className="px-6 py-2 bg-blue-600 text-white text-lg rounded mt-4"
        >
          ¡Presiona ahora!
        </button>
      )}

      {ganador && (
        <p className="mt-4 text-green-600 font-semibold">
          ✅ ¡{ganador === rol ? 'Tú ganaste el turno!' : `${ganador} ganó el turno!`}
        </p>
      )}
    </div>
  );
}
