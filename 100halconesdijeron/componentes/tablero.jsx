// componentes/tablero.js
'use client';

import React from 'react';

// Define itemStyle outside so TableroItem can use it
const itemStyle = {
  backgroundColor: '#00BFFF', // Light blue color for the items
  border: '3px solid #483D8B', // Darker blue border
  borderRadius: '10px',
  padding: '15px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start', // Align text to the start (left)
  color: '#333', // Default text color
  fontSize: '1.2em',
  fontWeight: 'bold',
  minWidth: '300px', // Ensure a minimum width for the items
};

// Helper component for an individual item (no circle) - now exported
export const TableroItem = ({ text }) => (
  <div style={itemStyle}>
    <span>{text}</span>
  </div>
);

export default function Tablero({ children }) {
  // Define some basic styling for the components to resemble the image
  const boardStyle = {
    backgroundColor: '#8A2BE2', // Purple color for the main board
    padding: '20px',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px', // Space between the blue rectangles
    width: 'fit-content', // Adjust width based on content
    margin: 'auto', // Center the board
  };

  return (
    <div style={boardStyle}>
      {/* You can pass specific children to render or use default items */}
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