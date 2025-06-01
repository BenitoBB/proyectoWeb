// componentes/tablero.js
'use client';

import React from 'react';

// Define itemStyle outside so TableroItem can use it
const itemStyle = {
  backgroundColor: '#00BFFF', // Azul claro para el fondo del item
  border: '3px solid #483D8B', // Azul oscuro para el borde
  borderRadius: '10px',
  padding: '15px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', // Alinear el texto a la izquierda
  color: '#333', // Color del texto
  fontSize: '1.2em',
  fontWeight: 'bold',
  minWidth: '300px', 
};

// Helper component for an individual item (no circle) - now exported
export const TableroItem = ({ text }) => (
  <div style={itemStyle}>
    <span>{text}</span>
  </div>
);

export default function Tablero({ children }) {
  const boardStyle = {
    backgroundColor: '#8A2BE2', // Color morado de la mesa
    padding: '20px',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column', 
    gap: '10px', // Espacio entre los items
    width: 'fit-content', // Ajusta el ancho al contenido
    margin: 'auto', // Centra el tablero horizontalmente
  };

  return (
    <div style={boardStyle}>
      {children ? (
        children
      ) : (
        <>
          <TableroItem text="Texto de ejemplo 1" />
          <TableroItem text="Texto de ejemplo 2" />
          <TableroItem text="Texto de ejemplo 3" />
          <TableroItem text="Texto de ejemplo 4" />
          <TableroItem text="Respuesta" />
        </>
      )}
    </div>
  );
}