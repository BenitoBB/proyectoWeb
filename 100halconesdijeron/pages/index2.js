// pages/index2.js
'use client'; // Ensure this is present for hooks like useState

import React, { useState } from "react";
import TituloJuego from "@/componentes/tituloJuego";
import Pregunta from "@/componentes/pregunta";
import Tablero, { TableroItem } from "@/componentes/tablero"; 
import Mesa from "@/componentes/Mesa"; // Assuming this is MesaDeBoton now
import Strikes from "@/componentes/Strikes";
import { Open_Sans } from 'next/font/google'; // Import Open Sans from next/font/google

// Configure the Open Sans font at the TOP LEVEL of the module (file)
const openSans = Open_Sans({
  subsets: ['latin'], 
  display: 'swap',   
});


export default function Stats() {
  const handleMesaButtonClick = () => {
      alert("¡Botón de la mesa clickeado!");
  };

  const [currentStrikes, setCurrentStrikes] = useState(0);

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
        backgroundSize: "cover", // Use cover to ensure the background always fills the div
        backgroundPosition: "center", // Center the background image
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Centers content horizontally
        padding: "20px",
        boxSizing: "border-box", // Include padding in the element's total width and height
      }}
    >
      {/* Game Title Image (Always at the top, centered) */}
      <img
        src="/titulo.png"
        alt="100 HALCONES DIJERON"
        style={{
          display: "block", // Ensures margin auto works for centering
          margin: "0 auto", // Center horizontally
          marginTop: "2rem",
          maxWidth: "90%",
          height: "auto",
          marginBottom: "20px", // Add space below the title
        }}
      />

      {/* Question Component */}
      <div style={{ marginBottom: "30px", width: "80%" }} className={openSans.className}>
        <Pregunta texto="Aquí va la pregunta principal del juego" />
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

        {/* Tablero in the center, applying Open Sans directly to Tablero's container */}
        <div className={openSans.className}> 
          <Tablero>
            <TableroItem text="Opción A: Primera respuesta" />
            <TableroItem text="Opción B: Segunda respuesta" />
            <TableroItem text="Opción C: Tercera respuesta" />
            <TableroItem text="Opción D: Cuarta respuesta" />
            <TableroItem text="Opción E: Quinta respuesta" />
          </Tablero>
        </div>

        {/* Right Component - Strikes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Strikes numStrikes={currentStrikes} />
        </div>
      </div>

      {/* Optional: Buttons to test strike count */}
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