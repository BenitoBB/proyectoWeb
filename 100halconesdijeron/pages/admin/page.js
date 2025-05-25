// pages/admin/page.js
// Permite seleccionar el juego, controlar
// el estado y ver estadisticas generales

'use client';

import { useState } from 'react';
import { GAMES, TOPICS, GAME_STATES } from '@/utils/constants';
import { useMQTT, publishMessage } from '@/utils/mqttClient';

export default function AdminPage() {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    publishMessage(TOPICS.GAME_SELECTION, game);
    publishMessage(TOPICS.GAME_STATE, GAME_STATES.STARTED);
  };

  const endGame = () => {
    publishMessage(TOPICS.GAME_STATE, GAME_STATES.FINISHED);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Administrador</h1>

      <div className="mb-4">
        <h2 className="font-semibold">Seleccionar juego:</h2>
        <div className="flex gap-2 mt-2">
          {Object.values(GAMES).map((game) => (
            <button
              key={game}
              onClick={() => handleSelectGame(game)}
              className={`px-4 py-2 rounded ${selectedGame === game ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              {game}
            </button>
          ))}
        </div>
      </div>

      <div>
        <button
          onClick={endGame}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Finalizar juego
        </button>
      </div>
    </div>
  );
}
