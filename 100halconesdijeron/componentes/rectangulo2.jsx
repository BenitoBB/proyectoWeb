'use client';

export default function Rectangulo2({ children, onClick, style = {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "#5145C6",
        borderRadius: "30px",
        border: "3px solid #000",
        width: "220px",
        height: "120px",
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