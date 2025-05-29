// pages/juego.js
'use client'; // This component will likely interact with the DOM or client-side features

import React from "react";
import TituloJuego from "@/componentes/tituloJuego"; // Make sure this path is correct
import Pregunta from "@/componentes/pregunta";     // Make sure this path is correct
import Tablero, { TableroItem } from "@/componentes/tablero"; // Make sure this path is correct
import Rectangulo from "@/componentes/rectangulo"; // Make sure this path is correct
import { Open_Sans } from 'next/font/google'; // Import Open Sans from next/font/google

// Configure the Open Sans font at the TOP LEVEL of the module (file)
const openSans = Open_Sans({
  subsets: ['latin'], 
  display: 'swap',   
});

export default function index3() { // Renamed the function to Juego for clarity

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/fondo.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Centers content horizontally
        padding: "20px",
      }}
    >
      {/* Game Title Image */}
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
      <div style={{ marginTop: "20px", width: "100%", textAlign: "center" }} className={openSans.className}>
        <Pregunta texto="Aquí va la pregunta principal del juego" />
      </div>

      {/* Main Game Board Layout: Rectangles (Left) - Tablero - Rectangles (Right) */}
      <div
        style={{
          display: "flex",
          flexDirection: "row", // Arrange items in a row
          alignItems: "center", // Align items centrally in the row
          gap: "30px",          // Space between groups of components (adjusted for visual appeal)
          marginTop: "30px",    // Space below the question
          justifyContent: 'center', // Center the entire row block
          width: 'fit-content', // Only take up space needed by content
          maxWidth: '90%', // Prevent overflow on smaller screens
        }}
      >
        {/* Left Rectangles Group */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Rectangulo>Siguiente ronda</Rectangulo> 
          <Rectangulo>Finalizar juego</Rectangulo> 
        </div>

        {/* Tablero in the center */}
        <div className={openSans.className}> 
          <Tablero>
            <TableroItem text="Opción A: Primera respuesta" />
            <TableroItem text="Opción B: Segunda respuesta" />
            <TableroItem text="Opción C: Tercera respuesta" />
            <TableroItem text="Opción D: Cuarta respuesta" />
            <TableroItem text="Opción E: Quinta respuesta" />
          </Tablero>
        </div>

        {/* Right Rectangles Group */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} >
          <Rectangulo>Turno de Jugador:</Rectangulo> 
          <Rectangulo>Contenido 1</Rectangulo>
        </div>
      </div>
    </div>
  );
}