'use client'; 

import React, { useState, useEffect } from "react";
import Pregunta from "@/componentes/pregunta";     
import Tablero, { TableroItem } from "@/componentes/tablero"; 
import Rectangulo from "@/componentes/rectangulo"; 
import { Open_Sans } from 'next/font/google'; 
import { useMQTT } from "@/utils/mqttClient";
import { TOPICS } from "@/utils/constants";
import { useSearchParams } from 'next/navigation';

const openSans = Open_Sans({
  subsets: ['latin'], 
  display: 'swap',   
});

export default function indexAdmin() { 
  const searchParams = useSearchParams();
  const rol = searchParams.get('rol') || 'admin'; // fallback por si acaso
  const [turnoActual, setTurnoActual] = useState("Esperando...");
  const [pregunta, setPregunta] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [respuestasAcertadas, setRespuestasAcertadas] = useState([]);
  const [ganador, setGanador] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Suscribirse al tópico de tablero
  useMQTT(TOPICS.ESTADO_TABLERO, (payload) => {
    const data = JSON.parse(payload);
    setRespuestasAcertadas(data.respuestasAcertadas);
  });
  
  // Suscribirse al tópico de turno rápido
  useMQTT(TOPICS.TURNO_RAPIDO, (payload) => {
    setTurnoActual(payload); // Solo esto
  });

  // Suscribirse al tópico de pregunta actual
  useMQTT(TOPICS.PREGUNTA_ACTUAL, (payload) => {
    const data = JSON.parse(payload); 
    setPregunta(data.pregunta);
    setRespuestas(data.respuestas);
  });
  
  // Suscribirse al tópico de ganador
  useMQTT(TOPICS.GANADOR, (payload) => {
    if (payload && payload !== "" && payload !== "Juego finalizado") {
      setGanador(payload);
      setShowModal(true);
    } else {
      setGanador("");
      setShowModal(false);
    }
  });

  console.log("respuestasAcertadas:", respuestasAcertadas);
  console.log("respuestas:", respuestas.map(r => r.texto_respuesta));

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/fondo.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", 
        padding: "20px",
      }}
    >
      {/* Titulo del Juego 100HALCONESDIJERON */}
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

      {/* Componente de Pregunta */}
      <div style={{ marginTop: "20px", width: "100%", textAlign: "center" }} className={openSans.className}>
        <Pregunta texto={pregunta ? pregunta.texto : "Da clic en Iniciar ronda"} />
      </div>

      {/* Distribucion de componentes */}
      <div
        style={{
          display: "flex",
          flexDirection: "row", 
          alignItems: "center", 
          gap: "30px",          
          marginTop: "30px",    
          justifyContent: 'center', 
          width: 'fit-content', 
          maxWidth: '90%', 
        }}
      >
        {/* Botones (izq) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Rectangulo onClick={() => {
  fetch('/api/iniciarRonda');
  setGanador("");
  setShowModal(false);
  setRespuestasAcertadas([]);
  setTurnoActual("Esperando...");
  setPregunta(null);      // <-- Limpia la pregunta
  setRespuestas([]);      // <-- Limpia las respuestas
}}>
  Iniciar ronda
</Rectangulo>
          <Rectangulo onClick={async () => {
  await fetch('/api/finalizarJuego');
  setGanador("Juego finalizado");
  setShowModal(false);
}}>
  Finalizar juego
</Rectangulo>
        </div> 

        {/* Turno/ganador (der) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} >
          <Rectangulo>Turno ganador a: {turnoActual}</Rectangulo>
          <Rectangulo>Ganador: {ganador}</Rectangulo> 
        </div>
      </div>

      {/* Modal de Ganador */}
      {showModal && ganador && ganador !== "Juego finalizado" && (
  <div style={{
    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
    background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
  }}>
    <div style={{
      background: "#fff", padding: "2rem", borderRadius: "1rem", textAlign: "center", minWidth: "300px"
    }}>
      <h2>¡Tenemos un ganador!</h2>
      <p>{ganador}</p>
      <button onClick={() => setShowModal(false)} style={{marginTop: "1rem"}}>Cerrar</button>
    </div>
  </div>
)}
    </div>
  );
}