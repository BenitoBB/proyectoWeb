import React from "react";
import TituloEstadisticas from "../../componentes/tituloEstadisticas";
import TituloJuego from "../../componentes/tituloJuego";
import Rectangulo from "../../componentes/rectangulo";

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
      {/* Centrar TituloEstadisticas */}
      <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}>
        <TituloEstadisticas />
      </div>
      
      {/* Rectángulos alineados horizontalmente */}
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rectangulo>Total de juegos:</Rectangulo>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rectangulo>Total de rondas:</Rectangulo>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rectangulo>Tiempo promedio:</Rectangulo>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}>
        <TituloJuego />
      </div>

      {/* Rectángulos alineados horizontalmente */}
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rectangulo>Contenido 1</Rectangulo>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rectangulo>Contenido 2</Rectangulo>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rectangulo>Contenido 3</Rectangulo>
        </div>
      </div>
    </div>
  );
}