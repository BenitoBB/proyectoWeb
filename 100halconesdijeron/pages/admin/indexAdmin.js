'use client'; 

import React from "react";
import TituloJuego from "@/componentes/tituloJuego"; 
import Pregunta from "@/componentes/pregunta";     
import Tablero, { TableroItem } from "@/componentes/tablero"; 
import Rectangulo from "@/componentes/rectangulo"; 
import { Open_Sans } from 'next/font/google'; 

const openSans = Open_Sans({
  subsets: ['latin'], 
  display: 'swap',   
});

export default function indexAdmin() { 

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
        <Pregunta texto="Aquí va la pregunta principal del juego" />
      </div>

      {/* Distribucion de componentes: Botones (Izq) - Tablero (Centro) - Botones (Der) */}
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
          <Rectangulo>Siguiente ronda</Rectangulo> 
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

        {/* Botones (der) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} >
          <Rectangulo>Turno de Jugador:</Rectangulo> 
          <Rectangulo>Contenido 1</Rectangulo>
        </div>
      </div>
    </div>
  );
}