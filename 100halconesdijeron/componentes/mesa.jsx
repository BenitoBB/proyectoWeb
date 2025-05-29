'use client';

export default function Mesa() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1.5rem 0" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Parte superior morada */}
        <div
          style={{
            width: "140px",
            height: "40px",
            background: "#4B2EA9",
            borderRadius: "20px",
            border: "3px solid #222",
            marginBottom: "8px"
          }}
        />
        {/* Conector */}
        <div
          style={{
            width: "20px",
            height: "20px",
            background: "#bdbdbd",
            border: "3px solid #222",
            borderRadius: "4px",
            marginBottom: "-10px",
            zIndex: 2
          }}
        />
        {/* Cuerpo de la mesa */}
        <div
          style={{
            width: "180px",
            height: "180px",
            background: "#888",
            border: "3px solid #222",
            borderRadius: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1
          }}
        >
          {/* Interior más claro */}
          <div
            style={{
              width: "140px",
              height: "140px",
              background: "#bdbdbd",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* Botón rojo */}
            <div
              style={{
                width: "70px",
                height: "70px",
                background: "#d32f3a",
                border: "3px solid #222",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <span style={{ color: "#fff", fontWeight: "bold", fontSize: "1.2rem" }}>Botón</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}