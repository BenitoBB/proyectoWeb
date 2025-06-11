'use client';
import React from 'react';

const itemStyle = {
  backgroundColor: '#00BFFF',
  border: '3px solid #483D8B',
  borderRadius: '10px',
  padding: '15px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start', // cambia a izquierda
  color: '#222',
  fontSize: '1.2em',
  fontWeight: 'bold',
  minWidth: '300px',
  lineHeight: '1.4', // mejora legibilidad
};

export const TableroItem = ({ text }) => (
  <div style={itemStyle}>
    <span>{text}</span>
  </div>
);

export default function Tablero({ children }) {
  const boardStyle = {
    backgroundColor: '#8A2BE2',
    padding: '30px',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: 'fit-content',
    margin: 'auto',
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
