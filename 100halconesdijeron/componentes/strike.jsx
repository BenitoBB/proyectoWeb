'use client';

export default function Strike({ children, onClick, style = {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "#0079B6",
        borderRadius: "30px",
        border: "3px solid #0079B6",
        width: "400px",
        height: "50px",
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
      <span style={{ color: "#222", fontWeight: "bold", fontSize: "1.3rem" }}>
        {children}
      </span>
    </button>
  );
}