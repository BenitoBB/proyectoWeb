// pages/index2.js
'use client'; // Ensure this is present for hooks like useState

import React, { useState, useEffect } from "react";
import Pregunta from "@/componentes/pregunta";
import Tablero, { TableroItem } from "@/componentes/tablero";
import Mesa from "@/componentes/Mesa";
import { Open_Sans } from 'next/font/google';
import Rectangulo from "@/componentes/rectangulo";
import { useSearchParams } from 'next/navigation';
import { useMQTT } from "@/utils/mqttClient";
import { TOPICS } from "@/utils/constants";
import { validarRespuesta } from "@/utils/validadorRespuestas";

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export default function indexMesa() {
  const searchParams = useSearchParams();
  const rol = searchParams.get('rol'); // 'jugadorA' o 'jugadorB'
  const nombreJugador = rol === 'jugadorA' ? 'Jugador A' : 'Jugador B';

  const [pregunta, setPregunta] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [dueloTerminado, setDueloTerminado] = useState(false);
  const [turno, setTurno] = useState(null);
  const [respuestaInput, setRespuestaInput] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [respuestasAcertadas, setRespuestasAcertadas] = useState([]);

  // Suscribirse al tópico de pregunta actual
  const { sendMessage } = useMQTT(TOPICS.PREGUNTA_ACTUAL, (payload) => {
    const data = JSON.parse(payload);
    setPregunta(data.pregunta);
    setRespuestas(data.respuestas);
  });

  // Lógica para el duelo de rapidez
  const handleDueloClick = () => {
    if (!turno && !dueloTerminado) {
      setTurno(nombreJugador);
      setDueloTerminado(true);
      sendMessage(TOPICS.TURNO_RAPIDO, nombreJugador); // Notifica al admin
    }
  };

  // Lógica para responder (solo el jugador con el turno puede responder)
  const handleResponder = () => {
    if (!respuestaInput.trim()) return;

    // Adaptar respuestas para el validador
    const respuestasValidas = respuestas.map(r => ({
      texto: r.texto_respuesta,
      sinonimos: r.sinonimos || [],
      puntos: r.puntaje
    }));

    const resultado = validarRespuesta(respuestaInput, respuestasValidas, respuestasAcertadas);

    if (resultado.acertada) {
      setMensaje(`¡Correcto! Ganaste ${resultado.puntos} puntos por: ${resultado.respuesta}`);
      setRespuestasAcertadas([...respuestasAcertadas, resultado.respuesta]);
      // Aquí puedes manejar si sigue el turno o avanza el juego
    } else {
      setMensaje("Respuesta incorrecta o ya fue respondida.");
      // Aquí puedes manejar el cambio de turno si aplica
    }

    setRespuestaInput("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/fondo.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <img
        src="/titulo.png"
        alt="100 HALCONES DIJERON"
        style={{
          display: "block",
          margin: "0 auto",
          marginTop: "2rem",
          maxWidth: "90%",
          height: "auto",
        }}
      />

      <div style={{ marginBottom: "30px", width: "80%" }} className={openSans.className}>
        <Pregunta texto={pregunta ? pregunta.texto : "Cargando pregunta..."} />
      </div>

      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "30px",
        marginTop: "30px",
        justifyContent: 'center',
        width: 'fit-content',
        maxWidth: '90%',
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {!dueloTerminado ? (
            <Rectangulo onClick={handleDueloClick}>
              ¡Presiona rápido!
            </Rectangulo>
          ) : turno === nombreJugador ? (
            <div>
              <div style={{ marginBottom: "10px", color: "#333", fontWeight: "bold" }}>
                ¡Tienes el turno! Escribe tu respuesta:
              </div>
              <input
                type="text"
                value={respuestaInput}
                onChange={e => setRespuestaInput(e.target.value)}
                style={{ padding: "10px", fontSize: "1.1em", borderRadius: "8px", border: "1px solid #aaa" }}
              />
              <button
                onClick={handleResponder}
                style={{
                  marginLeft: "10px",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  background: "#5145C6",
                  color: "#fff",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Responder
              </button>
              {mensaje && (
                <div style={{ marginTop: "10px", color: "#00796b", fontWeight: "bold" }}>
                  {mensaje}
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: "#333", fontWeight: "bold" }}>
              Esperando al otro jugador...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}