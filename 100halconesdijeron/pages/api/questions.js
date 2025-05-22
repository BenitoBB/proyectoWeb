/*
    Banco de preguntas para el juego "100 Halcones Dijeron"
*/
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
  },
  // Puedes agregar más preguntas aquí
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Devuelve una pregunta aleatoria
    const randomIndex = Math.floor(Math.random() * questions.length);
    res.status(200).json(questions[randomIndex]);
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}