// pages/index2.js
'use client'; 

import React, { useState } from "react";
import TituloJuego from "@/componentes/tituloJuego";
import Pregunta from "@/componentes/pregunta";
import Tablero, { TableroItem } from "@/componentes/tablero"; 
import Mesa from "@/componentes/Mesa"; 
import Strikes from "@/componentes/Strikes";
import { Open_Sans } from 'next/font/google'; 
import { useMQTT } from "@/utils/mqttClient";
import { TOPICS } from "@/utils/constants";

const openSans = Open_Sans({
  subsets: ['latin'], 
  display: 'swap',   
});


export default function index() {
  const handleMesaButtonClick = () => {
      alert("¡Botón de la mesa clickeado!");
  };

  const [currentStrikes, setCurrentStrikes] = useState(0);
  const [respuestasAcertadas, setRespuestasAcertadas] = useState([]);
  const [pregunta, setPregunta] = useState(null);

  // Escuchar el tablero
  useMQTT(TOPICS.ESTADO_TABLERO, (payload) => {
    const data = JSON.parse(payload);
    setRespuestasAcertadas(data.respuestasAcertadas);
  });

  useMQTT(TOPICS.PREGUNTA_ACTUAL, (payload) => {
    const data = JSON.parse(payload);
    setPregunta(data.pregunta);
  });

  const addStrike = () => {
    setCurrentStrikes(prevStrikes => Math.min(prevStrikes + 1, 2));
  };

  const resetStrikes = () => {
    setCurrentStrikes(0);
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
          marginBottom: "20px", 
        }}
      />

      <div style={{ marginBottom: "30px", width: "80%" }} className={openSans.className}>
        <Pregunta texto={pregunta ? pregunta.texto : "Esperando pregunta..."} />
      </div>

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
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Mesa onButtonClick={handleMesaButtonClick} />
        </div>

        <div className={openSans.className}> 
          <Tablero>
            {respuestasAcertadas.length === 0
              ? <TableroItem text="Esperando respuestas..." />
              : respuestasAcertadas.map((resp, idx) => (
                  <TableroItem key={idx} text={resp} />
                ))
            }
          </Tablero>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Strikes numStrikes={currentStrikes} />
        </div>
      </div>

      <div style={{ 
        marginTop: '30px', 
        display: 'flex', 
        gap: '15px', 
        paddingBottom: '20px'
      }}>
        <button onClick={addStrike} style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer' }}>Añadir Strike</button>
        <button onClick={resetStrikes} style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer' }}>Resetear Strikes</button>
      </div>
    </div>
  );
}