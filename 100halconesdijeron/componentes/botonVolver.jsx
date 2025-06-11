'use client';
import { useRouter } from 'next/router';
import React from 'react';

export default function BotonVolver({ children = 'Volver', onClick, style = {} }) {
  const router = useRouter();

  const handleButtonClick = (event) => {
    if (onClick) onClick(event);
    router.push('/');
  };

  return (
    <button
      type="button"
      onClick={handleButtonClick}
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
        transition: "all 0.2s ease",
        boxShadow: "2px 2px 8px rgba(0,0,0,0.3)",
        ...style,
      }}
      onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
      onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      onMouseOver={e => e.currentTarget.style.background = "#C5C000"}
      onMouseOut={e => e.currentTarget.style.background = "#DCE133"}
    >
      <span style={{ color: "#111", fontWeight: "bold", fontSize: "1.3rem" }}>
        {children}
      </span>
    </button>
  );
}
