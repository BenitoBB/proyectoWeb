// utils/constants.js
// Aqui se alojan las constantes y tópicos utilizados en la aplicación

export const TOPICS = {
  ESTADO_TABLERO: 'halcones/juego/tablero',
  RESPUESTA_JUGADOR: 'halcones/juego/respuesta',
  RESULTADO_VALIDACION: 'halcones/juego/resultado',
  NUEVO_JUEGO: 'halcones/juego/nuevo',
  FINALIZADO: 'halcones/juego/finalizado',

  NUEVA_RONDA: 'halcones/juego/nueva-ronda',

  PLAYER_RESPONSE: 'halcones/player-response',       // Mensajes de respuesta de los jugadores
  PLAYER_REGISTER: 'halcones/player-register',       // Cuando un jugador se registra

  // Tópicos específicos por juego (podrían tener sub-topics si es necesario)
  GAME1: 'halcones/game1', // 100 mexicanos dijeron
  GAME2: 'halcones/game2', // Pregunta y responde
  GAME3: 'halcones/game3', // 40 segundos, 5 preguntas
  PUNTAJE: 'halcones/juego/puntaje',

  PREGUNTA_ACTUAL: 'halcones/juego/pregunta_actual',
  TURNO_RAPIDO: 'halcones/juego/turno_rapido',

  RAPIDEZ_BOTON: 'halcones/juego/rapidez_boton',

  GANADOR: 'halcones/juego/ganador',
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
