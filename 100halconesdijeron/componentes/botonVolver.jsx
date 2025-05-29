// componentes/BotonVolver.js (assuming this is the file name and path)
'use client';

import { useRouter } from 'next/router'; // Import useRouter from next/router
import React from 'react'; // It's good practice to import React when using JSX

export default function BotonVolver({ children, onClick, style = {} }) {
  const router = useRouter(); // Initialize the router

  const handleButtonClick = (event) => {
    // If an onClick prop is provided, call it first
    if (onClick) {
      onClick(event);
    }
    // Then, navigate to the index page
    router.push('/'); // This navigates to the root (index.js is the default route for '/')
  };

  return (
    <button
      type="button"
      onClick={handleButtonClick} // Use our new handleButtonClick
      style={{
        background: "#DCE133",
        borderRadius: "40px",
        border: "3px solid #000",
        width: "120px",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        cursor: "pointer",
        outline: "none",
        transition: "transform 0.1s",
        ...style,
      }}
      onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
      onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <span style={{ color: "#fff", fontWeight: "bold", fontSize: "1.3rem" }}>
        {children}
      </span>
    </button>
  );
}