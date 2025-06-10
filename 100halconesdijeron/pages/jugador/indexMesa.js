// pages/jugador/indexMesa.js
"use client"; 

/* 1. Importaciones y definición de estados */
import React, { useState, useEffect, useRef } from "react";
import Pregunta from "@/componentes/pregunta"; // Componente para mostrar la pregunta actual
import Tablero, { TableroItem } from "@/componentes/tablero"; // Componente para el tablero de respuestas
import { Open_Sans } from "next/font/google"; // Fuente Open Sans
import Rectangulo from "@/componentes/rectangulo"; // Componente para el botón rectangular
import { useSearchParams, useRouter } from "next/navigation"; // Hook para obtener parámetros de búsqueda
import { useMQTT } from "@/utils/mqttClient"; // Hook para manejar la conexión MQTT
import { TOPICS } from "@/utils/constants"; // Constantes de tópicos MQTT
import Strike from "@/componentes/strike"; // Componente para mostrar los strikes

// Importar la fuente Open Sans //
const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

/* Componente principal */
export default function indexMesa() {
  const searchParams = useSearchParams();  // Obtener los parámetros de búsqueda de la URL
  const rol = searchParams.get("rol"); // 'jugadorA' o 'jugadorB'
  const nombreJugador = rol === "jugadorA" ? "Jugador A" : "Jugador B"; // Nombre del jugador basado en el rol

  // Estado para manejar la pregunta, respuestas, turno, mensajes y más
  const [pregunta, setPregunta] = useState(null); 
  const [respuestas, setRespuestas] = useState([]);

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

  /* 2. Suscrpciones MQTT y Efectos */
  // 2.1 Limpiar turno SOLO cuando cambia la ronda
  useEffect(() => {
    if (rondaId && rondaId !== prevRondaId.current) {
      setTurno(null);
      setMensaje("");
      setRespuestaInput("");
      setJuegoFinalizado(false);
      prevRondaId.current = rondaId;
    }
  }, [rondaId]);

  // 2.2 Escuchar el tablero
  useMQTT(TOPICS.ESTADO_TABLERO, (payload) => {
    const data = JSON.parse(payload);
    setRespuestasAcertadas(data.respuestasAcertadas);
    setStrikesA(data.strikesA || 0);
    setStrikesB(data.strikesB || 0);
    setPuedeRobar(data.puedeRobar || false);
    setRobando(data.robando || null);

    if (
      Array.isArray(data.respuestasAcertadas) &&
      data.respuestasAcertadas.length === 0 &&
      (data.strikesA === 0 || !data.strikesA) &&
      (data.strikesB === 0 || !data.strikesB)
    ) {
      setMensaje("");
      setRespuestaInput("");
      setJuegoFinalizado(false);
    }
  });

  /* 3. Lógica de interacción del jugador */
  // 3.1 Escuchar el turno
  useMQTT(TOPICS.TURNO_RAPIDO, (payload) => {
    setTurno(payload);
  });

  // 3.2 Suscribirse al tópico de pregunta actual
  const { sendMessage } = useMQTT(TOPICS.PREGUNTA_ACTUAL, (payload) => {
    const data = JSON.parse(payload);
    setPregunta(data.pregunta);
    setRespuestas(data.respuestas);
    setRondaId(data.rondaId); 
  });

  // 3.3 Escuchar el ganador
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

  // 3.4 Lógica para el duelo de rapidez
  const handleDueloClick = async () => {
    if (!turno && rondaId) {
      const res = await fetch("/api/dueloRapido", { // Endpoint para manejar el duelo rápido
        method: "POST", // Método POST para enviar datos
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jugador: nombreJugador, rondaId }),
      });
      const data = await res.json();
      setTurno(data.ganador);
    }
  };

  // 3.5 Enviar respuesta
  const handleResponder = async () => {
    if (!respuestaInput.trim() || turno !== nombreJugador) return;
    const res = await fetch("/api/responder", { // Endpoint para manejar respuestas
      method: "POST", // Método POST para enviar datos
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({
        jugador: nombreJugador,
        respuesta: respuestaInput,
        preguntaId: pregunta.id,
        rondaId: rondaId, 
      }),
    });
    const data = await res.json();
    setMensaje(data.mensaje);
    setRespuestaInput("");
  };

  // 3.6 Limpiar mensajes y respuestas al cambiar de turno
  useEffect(() => {
    setMensaje("");
    setRespuestaInput("");
  }, [turno]);

  // 3.7 Guardar el rol en sessionStorage para persistencia
  useEffect(() => {
    if (rol) sessionStorage.setItem("rol", rol);
  }, [rol]);

  // 3.8 Recuperar el rol guardado al cargar la página
  const savedRol =
    typeof window !== "undefined" ? sessionStorage.getItem("rol") : null;

  // 3.9 Mensaje de consola para depuración
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

  /* 4. Renderizado del componente */
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
