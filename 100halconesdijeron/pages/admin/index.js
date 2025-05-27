//pages/admin/page.js

'use client';

import { useState } from 'react';
import SalaEspera from '@/components/SalaEspera';
import JuegoEnVivoPanel from '@/components/JuegoEnVivoPanel';
import PuntajePanel from '@/components/PuntajePanel';
import { useMQTT } from '@/utils/mqttClient';
import { TOPICS } from '@/utils/constants';
import JuegoFinalizado from '@/components/JuegoFinalizado'; // Asegúrate de tener este componente

export default function AdminPage() {
  const [listo, setListo] = useState(false);
  const [juegoFinalizado, setJuegoFinalizado] = useState(false);
  const [puntajeFinal, setPuntajeFinal] = useState(null);

  useMQTT(TOPICS.FINALIZADO, (payload) => {
    const data = JSON.parse(payload);
    setJuegoFinalizado(true);
    setPuntajeFinal(data);
  });

  return (
    <div>
      <h1>Administrador</h1>
      {!listo ? (
        <SalaEspera rol="admin" setListoGlobal={setListo} />
      ) : juegoFinalizado ? (
        <JuegoFinalizado puntaje={puntajeFinal} esAdmin={true} />
      ) : (
        <>
          <PuntajePanel />
          <JuegoEnVivoPanel />
        </>
      )}
    </div>
  );
}
