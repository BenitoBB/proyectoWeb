// componentes/strikes.js
'use client';

import React from 'react';

export default function Strikes({ numStrikes = 0 }) { // numStrikes prop, defaults to 0
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 'fit-content',
    margin: '0 auto', // Center the component horizontally
  };

  const topBarStrikesStyle = {
    backgroundColor: '#6A0DAD', // Purple color for the top bar
    width: '150px', // Adjust width to match the image's proportions
    height: '25px', // Height of the top bar
    borderRadius: '10px 10px 0 0', // Rounded top corners
    marginBottom: '5px', // Small gap between top bar and body
    display: 'flex',       // Make it a flex container
    justifyContent: 'center', // Center text horizontally
    alignItems: 'center',    // Center text vertically
    color: 'white',        // White text color for readability
    fontSize: '0.9em',      // Font size
    fontWeight: 'bold',    // Bold text
  };

  const bodyStyle = {
    backgroundColor: '#808080', // Gray color for the main body
    border: '3px solid #696969', // Darker gray border
    borderRadius: '15px', // Rounded corners for the body
    padding: '20px',
    display: 'flex',
    flexDirection: 'row', // Arrange X's in a row
    justifyContent: 'center', // Center X's horizontally
    alignItems: 'center',    // Center X's vertically
    gap: '15px',             // Space between X's
    width: '200px',          // Width of the main body
    height: '200px',         // Height of the main body (adjusted to fit X's)
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Optional: subtle shadow for depth
    position: 'relative',    // For positioning the "neck"
    overflow: 'hidden',      // Hide overflow if content extends beyond bounds
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

  const xStyle = {
    color: '#FF0000', // Red color for the X
    fontSize: '5em',    // Large font size for the X
    fontWeight: 'bold',
    lineHeight: '1',     // Ensure X sits nicely
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)', // Optional: for a bit of pop
  };

  // Generate X's based on numStrikes prop
  const renderStrikes = () => {
    const strikes = [];
    // Cap numStrikes at a maximum of 2, as per your request
    const actualStrikes = Math.min(Math.max(0, numStrikes), 2);

    for (let i = 0; i < actualStrikes; i++) {
      strikes.push(<span key={i} style={xStyle}>X</span>);
    }
    return strikes;
  };

  return (
    <div style={containerStyle}>
      <div style={topBarStrikesStyle}>
        Strikes
      </div>
      <div style={bodyStyle}>
        <div style={neckStyle}></div> {/* The small connecting piece */}
        {renderStrikes()}
      </div>
    </div>
  );
}