//pages/jugador/index.js

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SalaEspera from '@/components/SalaEspera';
import TableroJugador from '@/components/TableroJugador';
import JugadorRespuesta from '@/components/JugadorRespuesta';
import { useMQTT } from '@/utils/mqttClient';
import { TOPICS } from '@/utils/constants';
import PuntajePanel from '@/components/PuntajePanel';
import JuegoFinalizado from '@/components/JuegoFinalizado';

export default function JugadorPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Jugador';
  const rol = searchParams.get('rol');

  if (!rol || !['jugadorA', 'jugadorB'].includes(rol)) {
    alert('Debes especificar el rol: jugadorA o jugadorB');
    return null;
  }

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

  useMQTT(TOPICS.NUEVO_JUEGO, () => {
    location.reload();
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
