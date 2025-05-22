/*
    Este archivo maneja la lógica del juego de preguntas y respuestas.
*/
import mqtt from 'mqtt';

let currentQuestion = null;
let round = 1;
const players = {}; // { nombreJugador: puntaje }
let respuestasDadas = [];
let respuestasRonda = {}; // { nombreJugador: { answer, points } }

// MQTT setup
const mqttClient = mqtt.connect('ws://localhost:9001');
const topic = 'game/events';

function publishEvent(event) {
  if (mqttClient.connected) {
    mqttClient.publish(topic, JSON.stringify(event));
  } else {
    mqttClient.once('connect', () => {
      mqttClient.publish(topic, JSON.stringify(event));
    });
  }
}

// Simulación de preguntas (puedes importar desde questions.js si prefieres)
const questions = [
  {
    question: "¿Algo que encuentras en una oficina?",
    answers: [
      { answer: "Escritorio", points: 30 },
      { answer: "Computadora", points: 25 },
      { answer: "Silla", points: 20 },
      { answer: "Teléfono", points: 15 },
      { answer: "Lápiz", points: 10 }
    ]
  }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Devuelve la pregunta actual, ronda, puntajes y respuestas de la ronda
    if (!currentQuestion) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      currentQuestion = questions[randomIndex];
    }
    res.status(200).json({
      round,
      question: currentQuestion.question,
      players,
      respuestasRonda
    });
  } else if (req.method === 'POST') {
    // Recibe respuesta del jugador
    const { player, answer } = req.body;
    if (!player) {
      return res.status(400).json({ message: 'Falta el nombre del jugador.' });
    }
    if (!currentQuestion) {
      return res.status(400).json({ message: 'No hay pregunta activa.' });
    }
    if (respuestasRonda[player]) {
      return res.status(200).json({ message: 'Ya respondiste esta ronda.' });
    }
    if (respuestasDadas.includes(answer.trim().toLowerCase())) {
      respuestasRonda[player] = { answer, points: 0 };
      return res.status(200).json({ correct: false, message: 'Respuesta ya dada', points: 0, total: players[player] || 0 });
    }
    const found = currentQuestion.answers.find(
      a => a.answer.toLowerCase() === answer.trim().toLowerCase()
    );
    let points = 0;
    if (found) {
      points = found.points;
      respuestasDadas.push(answer.trim().toLowerCase());
      players[player] = (players[player] || 0) + points;
    }
    respuestasRonda[player] = { answer, points };
    // No publicamos evento al jugador, solo confirmamos recepción
    res.status(200).json({ correct: !!found, points, total: players[player] });
  } else if (req.method === 'PUT') {
    // El admin pasa de ronda
    round += 1;
    const randomIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[randomIndex];
    respuestasDadas = [];
    respuestasRonda = {};
    publishEvent({
      type: 'nueva_ronda',
      round,
      question: currentQuestion.question
    });
    res.status(200).json({ message: 'Nueva ronda iniciada', round, question: currentQuestion.question });
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}