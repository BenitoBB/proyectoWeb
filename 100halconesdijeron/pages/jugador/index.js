//pages/jugador/page.js

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SalaEspera from '@/components/SalaEspera';
import TableroJugador from '@/components/TableroJugador';
import JugadorRespuesta from '@/components/JugadorRespuesta';
import { useMQTT } from '@/utils/mqttClient';
import { TOPICS } from '@/utils/constants';
import PuntajePanel from '@/components/PuntajePanel';
import JuegoFinalizado from '@/components/JuegoFinalizado'; // Asegúrate de tener este componente

export default function JugadorPage() {
  const params = useSearchParams();
  const name = params.get('name') || 'Jugador';

  // Detección del rol
  const nameLower = name.toLowerCase();
  let rol = 'jugadorB';
  if (nameLower.includes('a')) rol = 'jugadorA';
  if (nameLower.includes('admin')) rol = 'admin';

  const [listo, setListo] = useState(false);
  const [juegoFinalizado, setJuegoFinalizado] = useState(false);
  const [puntajeFinal, setPuntajeFinal] = useState(null);

  useMQTT(TOPICS.RESULTADO_VALIDACION, (payload) => {
    const data = JSON.parse(payload);
    if (data.jugador === name) {
      alert(data.resultado === 'acierto' ? '✅ ¡Correcto!' : '❌ Strike');
    }
  });

  useMQTT(TOPICS.FINALIZADO, (payload) => {
    const data = JSON.parse(payload);
    setJuegoFinalizado(true);
    setPuntajeFinal(data);
  });

  // Escucha para reinicio de juego
  useMQTT(TOPICS.NUEVO_JUEGO, () => {
    location.reload(); // O puedes hacer reset de estado manualmente
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bienvenido, {name}</h1>
      {!listo ? (
        <SalaEspera rol={rol} setListoGlobal={setListo} />
      ) : juegoFinalizado ? (
        <JuegoFinalizado puntaje={puntajeFinal} />
      ) : (
        <>
          <TableroJugador />
          <JugadorRespuesta nombre={name} />
          <PuntajePanel />
        </>
      )}
    </div>
  );
}
