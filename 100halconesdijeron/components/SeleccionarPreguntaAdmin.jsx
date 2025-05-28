'use client';

import { useEffect, useState } from 'react';

export default function SeleccionarPreguntaAdmin() {
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    fetch('/api/preguntas')
      .then(res => res.json())
      .then(setPreguntas);
  }, []);

  const handleSeleccionar = async (id) => {
    const res = await fetch('/api/iniciar-pregunta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preguntaId: id })
    });
    const data = await res.json();
    alert(data.mensaje);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Seleccionar pregunta para iniciar juego</h2>
      <ul>
        {preguntas.map(p => (
          <li key={p.id} className="mb-4 border p-4 rounded">
            <h3 className="font-semibold">{p.texto}</h3>
            <ul className="ml-4 text-sm text-gray-600">
              {p.respuestas.map((r, i) => (
                <li key={i}>
                  {r.texto} ({r.puntos} pts) – sinónimos: {r.sinonimos.join(', ')}
                </li>
              ))}
            </ul>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => handleSeleccionar(p.id)}
            >
              Usar esta pregunta
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}