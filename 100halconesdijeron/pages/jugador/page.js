// pages/jugador/page.js
// Esta es la interfaz general del jugador.
// Aqui se conectara por MQTT, mostrara el juego
// actual (cuando el admin lo seleccione)

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMQTT } from '@/utils/mqttClient';
import { TOPICS, GAME_STATES, GAMES } from '@/utils/constants';

export default function JugadorPage() {
  const params = useSearchParams();
  const name = params.get('name') || 'Jugador';
  const [gameSelected, setGameSelected] = useState(null);
  const [gameState, setGameState] = useState(GAME_STATES.WAITING);

  useMQTT(TOPICS.GAME_SELECTION, (msg) => {
    setGameSelected(msg.payloadString);
  });

  useMQTT(TOPICS.GAME_STATE, (msg) => {
    setGameState(msg.payloadString);
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bienvenido, {name}</h1>
      <p>Juego seleccionado por el admin: <strong>{gameSelected || 'Esperando...'}</strong></p>
      <p>Estado del juego: <strong>{gameState}</strong></p>

      {/* Aquí se puede condicionar el render según el juego */}
      {gameSelected === GAMES.GAME1 && <p>Aquí irá el componente del juego 1</p>}
      {gameSelected === GAMES.GAME2 && <p>Aquí irá el componente del juego 2</p>}
      {gameSelected === GAMES.GAME3 && <p>Aquí irá el componente del juego 3</p>}
    </div>
  );
}
