// componentes/mesaDeBoton.js
'use client';

import React from 'react';

export default function Mesa({ onButtonClick, topText = "Tu respuesta" }) { // Added topText prop with default
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 'fit-content',
    margin: '0 auto', // Center the component horizontally
  };

  const topBarDummyStyle = {
    backgroundColor: '#6A0DAD', // Purple color for the top bar
    width: '150px', // Adjust width to match the image's proportions
    height: '25px', // Height of the top bar
    borderRadius: '10px 10px 0 0', // Rounded top corners
    marginBottom: '5px', // Small gap between top bar and body
    display: 'flex',       // Make it a flex container
    justifyContent: 'center', // Center text horizontally
    alignItems: 'center',    // Center text vertically
    color: 'white',        // White text color for readability
    fontSize: '0.9em',      // Slightly smaller font size
    fontStyle: 'italic',   // Make text italic
  };

  const bodyStyle = {
    backgroundColor: '#808080', // Gray color for the main body
    border: '3px solid #696969', // Darker gray border
    borderRadius: '15px', // Rounded corners for the body
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '200px', // Width of the main body
    height: '200px', // Height of the main body
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Optional: subtle shadow for depth
    position: 'relative', // For positioning the "neck"
  };

  const neckStyle = {
    backgroundColor: '#808080', // Same gray as body
    width: '20px',
    height: '20px',
    position: 'absolute',
    top: '-20px', // Position it above the main body
    left: '50%',
    transform: 'translateX(-50%)', // Center it horizontally
    borderLeft: '3px solid #696969',
    borderRight: '3px solid #696969',
  };

  const buttonStyle = {
    backgroundColor: '#FF0000', // Red color for the button
    border: '3px solid #B22222', // Darker red border
    borderRadius: '50%', // Makes it a circle
    width: '100px',
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '1.8em',
    fontWeight: 'bold',
    cursor: 'pointer', // Indicates it's clickable
    transition: 'background-color 0.2s ease', // Smooth transition on hover/active
    userSelect: 'none', // Prevent text selection
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
    console.log('Botón clickeado!'); // For demonstration
  };

  return (
    <div style={containerStyle}>
      <div style={topBarDummyStyle}>
        {topText} {/* Display the text here */}
      </div>
      <div style={bodyStyle}>
        <button
          style={buttonStyle}
          onClick={handleButtonClick}
          // Optional: Add hover/active effects for better UX
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E00000'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF0000'}
          onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#C00000'}
          onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#E00000'}
        >
          Botón
        </button>
      </div>
    </div>
  );
}