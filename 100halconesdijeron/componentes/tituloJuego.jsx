'use client';
import { Open_Sans } from 'next/font/google'; // Import Open Sans from next/font/google
// Configure the Open Sans font at the TOP LEVEL of the module (file)
const openSans = Open_Sans({
  subsets: ['latin'], 
  display: 'swap',   
});
export default function TituloJuego() {
  return (
    <div className={openSans.className}
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
        JUEGOS
      </span>
    </div>
  );
}