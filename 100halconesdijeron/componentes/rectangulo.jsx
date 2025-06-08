'use client';

export default function Rectangulo({ children, onClick, style = {}, disabled = false }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#aaa" : "#d32f3a",
        borderRadius: "30px",
        border: "3px solid #000",
        width: "220px",
        height: "120px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        cursor: disabled ? "not-allowed" : "pointer",
        outline: "none",
        transition: "transform 0.1s",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={e => !disabled && (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={e => !disabled && (e.currentTarget.style.transform = "scale(1)")}
    >
      <span style={{ color: "#fff", fontWeight: "bold", fontSize: "1.3rem" }}>
        {children}
      </span>
    </button>
  );
}