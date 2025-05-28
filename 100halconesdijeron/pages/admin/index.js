//pages/admin/page.js

'use client';

import { useState } from 'react';
import SalaEspera from '@/components/SalaEspera';
import JuegoEnVivoPanel from '@/components/JuegoEnVivoPanel';
import PuntajePanel from '@/components/PuntajePanel';
import { useMQTT } from '@/utils/mqttClient';
import { TOPICS } from '@/utils/constants';
import JuegoFinalizado from '@/components/JuegoFinalizado'; // Asegúrate de tener este componente
import MesaRapidezAdmin from '@/components/MesaRapidezAdmin';
import SeleccionarPreguntaAdmin from '@/components/SeleccionarPreguntaAdmin';

export default function AdminPage() {
  const [listo, setListo] = useState(false);
  const [juegoFinalizado, setJuegoFinalizado] = useState(false);
  const [puntajeFinal, setPuntajeFinal] = useState(null);
  const [juego, setJuego] = useState({ fase: 'espera' });
  const [tablero, setTablero] = useState({
    pregunta: '',
    turno: '',
    respuestas_validas: [],
    respuestas_acertadas: [],
    strikes: 0
  });

  useMQTT(TOPICS.FINALIZADO, (payload) => {
    const data = JSON.parse(payload);
    setJuegoFinalizado(true);
    setPuntajeFinal(data);
  });

  useMQTT(TOPICS.ESTADO_TABLERO, (payload) => {
    const data = JSON.parse(payload);
    setTablero(data);
  });

  useMQTT(TOPICS.ESTADO_JUEGO, (payload) => {
    const data = JSON.parse(payload);
    setJuego(data);
  });

  // Escuchar la pregunta seleccionada por el admin
  useMQTT('halcones/juego/seleccionada', (payload) => {
    const data = JSON.parse(payload);
    setTablero(data);
    setJuego({ fase: 'pulsador' }); // Cambia la fase para mostrar MesaRapidezAdmin
  });

  return (
    <div>
      <h1>Administrador</h1>
      {!listo ? (
        <SalaEspera rol="admin" setListoGlobal={setListo} />
      ) : juego.fase === 'espera' ? (
        <SeleccionarPreguntaAdmin />
      ) : juegoFinalizado ? (
        <JuegoFinalizado puntaje={puntajeFinal} esAdmin={true} />
      ) : (
        <>
          <PuntajePanel />
          {/* Muestra la mesa rapidez si está en esa fase */}
          {juego.fase === 'pulsador' && (
            <MesaRapidezAdmin pregunta={tablero.pregunta} />
          )}
          <JuegoEnVivoPanel />
        </>
      )}
    </div>
  );
}
