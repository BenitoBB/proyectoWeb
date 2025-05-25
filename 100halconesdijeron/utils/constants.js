// utils/constants.js

export const TOPICS = {
  GAME_SELECTION: 'halcones/game-selection',         // El admin selecciona el juego
  GAME_STATE: 'halcones/game-state',                 // Cambios de estado del juego (iniciado, terminado)
  GAME_SCORE: 'halcones/game-score',                 // Puntos actualizados
  GAME_WINNER: 'halcones/game-winner',               // Mensaje final de ganador

  PLAYER_RESPONSE: 'halcones/player-response',       // Mensajes de respuesta de los jugadores
  PLAYER_REGISTER: 'halcones/player-register',       // Cuando un jugador se registra

  // Tópicos específicos por juego (podrían tener sub-topics si es necesario)
  GAME1: 'halcones/game1', // 100 mexicanos dijeron
  GAME2: 'halcones/game2', // Pregunta y responde
  GAME3: 'halcones/game3', // 40 segundos, 5 preguntas
};

export const GAMES = {
  GAME1: '100 Halcones Dijeron',
  GAME2: 'Pregunta y responde',
  GAME3: '40 segundos, 5 preguntas',
};

export const GAME_STATES = {
  WAITING: 'esperando',
  STARTED: 'iniciado',
  FINISHED: 'finalizado',
};
