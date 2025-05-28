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
import MesaRapidez from '@/components/MesaRapidez';

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
  const [juego, setJuego] = useState({ fase: 'espera' }); // Estado del juego, por defecto en 'espera'
  const [turnoGanado, setTurnoGanado] = useState(null);
  const [tablero, setTablero] = useState({
    pregunta: '',
    turno: '',
    respuestas_validas: [],
    respuestas_acertadas: [],
    strikes: 0
  });

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
 
  // Escuchar la pregunta seleccionada por el admin
  useMQTT('halcones/juego/seleccionada', (payload) => {
    const data = JSON.parse(payload);
    setTablero(data);
    setJuego({ fase: 'pulsador' }); // Cambia la fase para mostrar MesaRapidez
  });

  // Si el juego está en la fase de 'pulsador', muestra el componente MesaRapidez
  if (juego.fase === 'pulsador') {
    return <MesaRapidez jugador={rol} />;
  }

  // lógica para obtener la pregunta actual
  const preguntaActual = tablero.pregunta || '...';

  if (listo && !turnoGanado) {
    return (
      <div className="p-4">
        <TableroJugador tablero={tablero} setTablero={setTablero} />
        <MesaRapidez
          pregunta={preguntaActual}
          nombre={name}
          rol={rol}
          setTurnoGanado={setTurnoGanado}
        />
      </div>
    );
  }

  // luego el juego normal:
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bienvenido, {name}</h1>
      {!listo ? (
        <SalaEspera rol={rol} setListoGlobal={setListo} />
      ) : juegoFinalizado ? (
        <JuegoFinalizado puntaje={puntajeFinal} />
      ) : (
        <>
          <PuntajePanel />
          <TableroJugador />
          <JugadorRespuesta nombre={name} rol={rol} />
        </>
      )}
    </div>
  );
}
