// pages/index2.js
import React from "react";
import TituloJuego from "@/componentes/tituloJuego";
import Pregunta from "@/componentes/pregunta";
import Tablero, { TableroItem } from "@/componentes/tablero"; // Import TableroItem here
import Mesa from "@/componentes/mesa";

export default function Stats() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/fondo.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
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

      <div>
        <Pregunta texto="Aqui va la pregunta" />
      </div>

      <div>
        <Tablero>
          <TableroItem text="Opción A:" />
          <TableroItem text="Opción B: Segunda línea." />
          <TableroItem text="¡Final del juego!" />
        </Tablero>
      </div>

      <div>
        <Mesa/>
      </div>
    </div>
  );
}