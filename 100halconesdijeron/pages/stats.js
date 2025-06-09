import React, { useEffect, useState } from "react";
import TituloEstadisticas from "../componentes/tituloEstadisticas";
import TituloJuego from "../componentes/tituloJuego";
import Rectangulo from "../componentes/rectangulo";
import Rectangulo2 from "@/componentes/rectangulo2";
import BotonVolver from "@/componentes/botonVolver";

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

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
          <Rectangulo>Total de juegos: {stats ? stats.totalJuegos : "..."}</Rectangulo>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rectangulo>Total de rondas: {stats ? stats.totalRondas : "..."}</Rectangulo>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rectangulo>Pregunta más jugada: {stats ? stats.preguntaMasJugada : "..."}</Rectangulo>
        </div>
      </div>
 
      <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}>
        <TituloJuego /> 
      </div>

      {/* Más estadísticas */}
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rectangulo2>Respuesta con más puntaje: {stats ? stats.respuestaMasPuntaje : "..."}</Rectangulo2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rectangulo2>Respuesta más popular: {stats ? stats.respuestaMasPopular : "..."}</Rectangulo2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rectangulo2>Promedio de respuestas acertadas por ronda: {stats ? stats.promedioRespuestasPorRonda : "..."}</Rectangulo2>
        </div>
      </div>

      <div style={{
        marginTop: '30px',
        display: 'flex',
        gap: '15px',
        paddingBottom: '20px'
      }}>
        <BotonVolver>Volver</BotonVolver>
      </div>
    </div>
  );
}