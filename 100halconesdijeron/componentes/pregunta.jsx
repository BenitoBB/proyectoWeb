'use client';

export default function Pregunta({ texto }) {
  return (
    <div
      style={{
        background: "#cfdede",
        border: "3px solid #000",
        borderRadius: "40px",
        width: "95%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0.5rem 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span
        style={{
          color: "#222",
          fontWeight: "bold",
          fontSize: "2rem",
          letterSpacing: "1px",
        }}
      >
        {texto}
      </span>
    </div>
  );
}
