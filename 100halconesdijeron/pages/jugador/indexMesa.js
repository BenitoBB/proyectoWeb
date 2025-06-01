// pages/index2.js
'use client'; // Ensure this is present for hooks like useState

import React, { useState } from "react";
import TituloJuego from "@/componentes/tituloJuego";
import Pregunta from "@/componentes/pregunta";
import Tablero, { TableroItem } from "@/componentes/tablero"; 
import Mesa from "@/componentes/Mesa"; 
import Strikes from "@/componentes/Strikes";
import Strike from "@/componentes/strike";
import { Open_Sans } from 'next/font/google'; 
import Rectangulo from "@/componentes/rectangulo";

const openSans = Open_Sans({
  subsets: ['latin'], 
  display: 'swap',   
});


export default function indexMesa() {
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
        backgroundSize: "auto", 
        backgroundPosition: "center", 
        display: "flex",
        flexDirection: "column",
        alignItems: "center", 
        padding: "20px",
        boxSizing: "border-box", 
      }}
    >
      {/* Game Title Image (Always at the top, centered) */}
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
        

        {/* Tablero in the center, applying Open Sans directly to Tablero's container */}
        <div className={openSans.className} textAlign="center"> 
            <Strike>Cantidad de Strikes</Strike>
          <Tablero>
            <TableroItem text="1" />
            <TableroItem text="2" />
            <TableroItem text="3" />
            <TableroItem text="4" />
            <TableroItem text="5" />
          </Tablero>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Mesa onButtonClick={handleMesaButtonClick} />
        </div>
      </div>

    </div>
  );
}