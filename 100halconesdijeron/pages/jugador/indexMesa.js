// pages/index2.js
"use client"; // Ensure this is present for hooks like useState

import React, { useState, useEffect, useRef } from "react";
import Pregunta from "@/componentes/pregunta";
import Tablero, { TableroItem } from "@/componentes/tablero";
import Mesa from "@/componentes/Mesa";
import { Open_Sans } from "next/font/google";
import Rectangulo from "@/componentes/rectangulo";
import { useSearchParams, useRouter } from "next/navigation";
import { useMQTT } from "@/utils/mqttClient";
import { TOPICS } from "@/utils/constants";
import { validarRespuesta } from "@/utils/validadorRespuestas";
import Strike from "@/componentes/strike";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export default function indexMesa() {
  const searchParams = useSearchParams();
  const rol = searchParams.get("rol"); // 'jugadorA' o 'jugadorB'
  const nombreJugador = rol === "jugadorA" ? "Jugador A" : "Jugador B";

  const [pregunta, setPregunta] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [dueloTerminado, setDueloTerminado] = useState(false);
  const [turno, setTurno] = useState(null);
  const [respuestaInput, setRespuestaInput] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [respuestasAcertadas, setRespuestasAcertadas] = useState([]);
  const [strikesA, setStrikesA] = useState(0);
  const [strikesB, setStrikesB] = useState(0);
  const [puedeRobar, setPuedeRobar] = useState(false);
  const [robando, setRobando] = useState(null);
  const [rondaId, setRondaId] = useState(null);
  const [ganador, setGanador] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [juegoFinalizado, setJuegoFinalizado] = useState(false);

  const prevRondaId = useRef();

  // Limpiar turno SOLO cuando cambia la ronda
  useEffect(() => {
    if (rondaId && rondaId !== prevRondaId.current) {
      setTurno(null);
      setMensaje("");
      setRespuestaInput("");
      setJuegoFinalizado(false);
      prevRondaId.current = rondaId;
    }
  }, [rondaId]);

  // Escuchar el tablero
  useMQTT(TOPICS.ESTADO_TABLERO, (payload) => {
    const data = JSON.parse(payload);
    setRespuestasAcertadas(data.respuestasAcertadas);
    setStrikesA(data.strikesA || 0);
    setStrikesB(data.strikesB || 0);
    setPuedeRobar(data.puedeRobar || false);
    setRobando(data.robando || null);

    // Si el tablero está limpio, reinicia el estado local
    if (
      Array.isArray(data.respuestasAcertadas) &&
      data.respuestasAcertadas.length === 0 &&
      (data.strikesA === 0 || !data.strikesA) &&
      (data.strikesB === 0 || !data.strikesB)
    ) {
      setMensaje("");
      setRespuestaInput("");
      setJuegoFinalizado(false);
      // NO pongas setTurno(null) aquí
    }
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
    setRondaId(data.rondaId); // <-- esto debe ejecutarse
  });

  // Escuchar el ganador
  useMQTT(TOPICS.GANADOR, (payload) => {
    if (payload === "Juego finalizado") {
      setJuegoFinalizado(true);
      setGanador("");
      setShowModal(false);
    } else if (payload && payload !== "") {
      setGanador(payload);
      setShowModal(true);
      setJuegoFinalizado(false);
    } else {
      setGanador("");
      setShowModal(false);
      setJuegoFinalizado(false);
    }
  });

  // Lógica para el duelo de rapidez
  const handleDueloClick = async () => {
    if (!turno && rondaId) {
      const res = await fetch("/api/dueloRapido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jugador: nombreJugador, rondaId }),
      });
      const data = await res.json();
      setTurno(data.ganador);
    }
  };

  // Enviar respuesta
  const handleResponder = async () => {
    if (!respuestaInput.trim() || turno !== nombreJugador) return;
    const res = await fetch("/api/responder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jugador: nombreJugador,
        respuesta: respuestaInput,
        preguntaId: pregunta.id,
        rondaId: rondaId, // falta rondaId aquí
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

  useEffect(() => {
    if (rol) sessionStorage.setItem("rol", rol);
  }, [rol]);

  const savedRol =
    typeof window !== "undefined" ? sessionStorage.getItem("rol") : null;

  console.log(
    "nombreJugador:",
    nombreJugador,
    "rol:",
    rol,
    "turno:",
    turno,
    "rondaId:",
    rondaId
  );
  console.log("respuestasAcertadas:", respuestasAcertadas);
  console.log(
    "respuestas:",
    respuestas.map((r) => r.texto_respuesta)
  );

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

      <div
        style={{ marginTop: "3rem", marginBottom: "30px", width: "80%" }}
        className={openSans.className}
      >
        <Pregunta texto={pregunta ? pregunta.texto : "Esperando pregunta..."} />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "30px",
          marginTop: "30px",
          justifyContent: "center",
          width: "fit-content",
          maxWidth: "90%",
        }}
      >
        <div className={openSans.className}>
          <Tablero>
            {respuestas.slice(0, 5).map((resp, idx) => {
              const acertada = respuestasAcertadas.some(
                (r) =>
                  r.trim().toLowerCase() ===
                  resp.texto_respuesta.trim().toLowerCase()
              );
              return (
                <TableroItem
                  key={idx}
                  text={acertada ? resp.texto_respuesta : `${idx + 1}`}
                />
              );
            })}
          </Tablero>
        </div>
        {!juegoFinalizado && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {!turno && rondaId ? (
              <Rectangulo onClick={handleDueloClick}>
                ¡Presiona rápido!
              </Rectangulo>
            ) : turno === nombreJugador ? (
              <div>
                <div
                  style={{
                    marginBottom: "10px",
                    color: "#333",
                    fontWeight: "bold",
                  }}
                >
                  ¡Tienes el turno! Escribe tu respuesta:
                </div>
                <input
                  type="text"
                  value={respuestaInput}
                  onChange={(e) => setRespuestaInput(e.target.value)}
                  style={{
                    padding: "10px",
                    fontSize: "1.1em",
                    borderRadius: "8px",
                    border: "1px solid #aaa",
                  }}
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
                    cursor: "pointer",
                  }}
                  disabled={turno !== nombreJugador}
                >
                  Responder
                </button>
                {mensaje && (
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#00796b",
                      fontWeight: "bold",
                    }}
                  >
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
        )}
      </div>
      {!juegoFinalizado && (
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <Strike>Strikes A: {strikesA}</Strike>
          <Strike>Strikes B: {strikesB}</Strike>
        </div>
      )}

      {puedeRobar && !juegoFinalizado && (
        <div style={{ color: "red", fontWeight: "bold" }}>
          ¡{robando === nombreJugador ? "Tienes" : "El otro jugador tiene"}{" "}
          oportunidad de robar!
        </div>
      )}
      {showModal && ganador && ganador !== "Juego finalizado" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "1rem",
              textAlign: "center",
              minWidth: "300px",
            }}
          >
            <h2>¡Tenemos un ganador!</h2>
            <p>{ganador}</p>
            <button
              onClick={() => setShowModal(false)}
              style={{ marginTop: "1rem" }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
