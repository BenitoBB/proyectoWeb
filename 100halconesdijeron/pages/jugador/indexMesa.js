// pages/index2.js
'use client'; // Ensure this is present for hooks like useState

import React, { useState, useEffect } from "react";
import Pregunta from "@/componentes/pregunta";
import Tablero, { TableroItem } from "@/componentes/tablero";
import Mesa from "@/componentes/Mesa";
import { Open_Sans } from 'next/font/google';
import Rectangulo from "@/componentes/rectangulo";
import { useSearchParams, useRouter } from 'next/navigation';
import { useMQTT } from "@/utils/mqttClient";
import { TOPICS } from "@/utils/constants";
import { validarRespuesta } from "@/utils/validadorRespuestas";

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export default function indexMesa() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rol = searchParams.get('rol'); // 'jugadorA' o 'jugadorB'
  const nombreJugador = rol === 'jugadorA' ? 'Jugador A' : 'Jugador B';

  const [pregunta, setPregunta] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [dueloTerminado, setDueloTerminado] = useState(false);
  const [turno, setTurno] = useState(null);
  const [respuestaInput, setRespuestaInput] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [respuestasAcertadas, setRespuestasAcertadas] = useState([]);

  // Escuchar el tablero
  useMQTT(TOPICS.ESTADO_TABLERO, (payload) => {
    const data = JSON.parse(payload);
    setRespuestasAcertadas(data.respuestasAcertadas);
  });

  // Escuchar el turno
  useMQTT(TOPICS.TURNO_RAPIDO, (payload) => {
    setTurno(payload);
  });

  // Suscribirse al tópico de pregunta actual
  const { sendMessage } = useMQTT(TOPICS.PREGUNTA_ACTUAL, (payload) => {
    const data = JSON.parse(payload);
    setPregunta(data.pregunta);
    setRespuestas(data.respuestas);
  });

  // Lógica para el duelo de rapidez
  const handleDueloClick = async () => {
    if (!turno && !dueloTerminado) {
      setDueloTerminado(true);
      // Envía al backend quién presionó
      const res = await fetch('/api/dueloRapido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jugador: nombreJugador }),
      });
      const data = await res.json();
      setTurno(data.ganador);
    }
  };

  // Enviar respuesta
  const handleResponder = async () => {
    if (!respuestaInput.trim() || turno !== nombreJugador) return;
    const res = await fetch('/api/responder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jugador: nombreJugador,
        respuesta: respuestaInput,
        preguntaId: pregunta.id,
      }),
    });
    const data = await res.json();
    setMensaje(data.mensaje);
    setRespuestaInput("");
  };

  useEffect(() => {
    setMensaje("");
    setRespuestaInput("");
  }, [turno]);

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
        <Pregunta texto={pregunta ? pregunta.texto : "Esperando pregunta..."} />
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
        <div className={openSans.className}>
          <Tablero>
            {respuestas.slice(0, 5).map((resp, idx) => {
              const acertada = respuestasAcertadas.includes(resp.texto_respuesta);
              return (
                <TableroItem key={idx} text={acertada ? resp.texto_respuesta : `${idx + 1}`} />
              );
            })}
          </Tablero>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {!dueloTerminado && !turno ? (
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
                disabled={turno !== nombreJugador}
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
                disabled={turno !== nombreJugador}
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