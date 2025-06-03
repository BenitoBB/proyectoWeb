'use client'; 

import React, { useState, useEffect } from "react";
import TituloJuego from "@/componentes/tituloJuego"; 
import Pregunta from "@/componentes/pregunta";     
import Tablero, { TableroItem } from "@/componentes/tablero"; 
import Rectangulo from "@/componentes/rectangulo"; 
import { Open_Sans } from 'next/font/google'; 
import { useMQTT } from "@/utils/mqttClient";
import { TOPICS } from "@/utils/constants";

const openSans = Open_Sans({
  subsets: ['latin'], 
  display: 'swap',   
});

export default function indexAdmin() { 
  const [turnoActual, setTurnoActual] = useState("Esperando...");
  const [pregunta, setPregunta] = useState(null);
  const [respuestas, setRespuestas] = useState([]);

  // Suscribirse al tópico de turno rápido
  useMQTT(TOPICS.TURNO_RAPIDO, (payload) => {
    setTurnoActual(payload); // payload debe ser "Jugador A", "Jugador B", etc.
  });
  // Suscribirse al tópico de pregunta actual
  useMQTT(TOPICS.PREGUNTA_ACTUAL, (payload) => {
    const data = JSON.parse(payload);
    setPregunta(data.pregunta);
    setRespuestas(data.respuestas);
  });

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
        <Pregunta texto={pregunta ? pregunta.texto : "Esperando pregunta..."} />
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
          <Rectangulo onClick={() => fetch('/api/iniciarRonda')}>
            Iniciar ronda
          </Rectangulo>
          <Rectangulo>Finalizar juego</Rectangulo>
        </div>

        {/* Tablero en el centro */}
        <div className={openSans.className}> 
          <Tablero>
            <TableroItem text="Opción A: Primera respuesta" />
            <TableroItem text="Opción B: Segunda respuesta" />
            <TableroItem text="Opción C: Tercera respuesta" />
            <TableroItem text="Opción D: Cuarta respuesta" />
            <TableroItem text="Opción E: Quinta respuesta" />
          </Tablero>
        </div>

        {/* Turno/ganador (der) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} >
          <Rectangulo>Turno de Jugador:</Rectangulo> 
          <Rectangulo>{turnoActual}</Rectangulo>
        </div>
      </div>
    </div>
  );
}