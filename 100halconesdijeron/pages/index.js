+'use client';

import { useRouter } from 'next/navigation';
import Rectangulo from '@/componentes/rectangulo';
import Rectangulo2 from '@/componentes/rectangulo2';
import Pregunta from '@/componentes/pregunta';
import { Open_Sans } from 'next/font/google'; 

const openSans = Open_Sans({
  subsets: ['latin'], 
  display: 'swap',   
});

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/fondo.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: "1rem",
          padding: "2rem 3rem",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
        className={openSans.className}
      >
        {/* Título con tamaño mayor */}
        <img
          src="/titulo.png"
          alt="100 HALCONES"
          style={{
            maxWidth: "350px",  // aumento tamaño
            height: "auto",
            margin: "0 auto 1.5rem",
            display: "block",
            filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))",
          }}
        />

        {/* Descripción con texto más grande */}
        <div style={{ fontSize: '1.6rem', fontWeight: '600', marginBottom: '2rem' }}>
          <Pregunta texto="Un juego en tiempo real con WebSocket + MQTT" />
        </div>

        {/* Botones */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "2.5rem",
          }}
        >
          <Rectangulo onClick={() => router.push('/jugador?name=JugadorA&rol=jugadorA')}>
            Jugador A
          </Rectangulo>
          <Rectangulo onClick={() => router.push('/jugador?name=JugadorB&rol=jugadorB')}>
            Jugador B
          </Rectangulo>
          <Rectangulo2 onClick={() => router.push('/admin')}>
            Administrador
          </Rectangulo2>
          <Rectangulo2 onClick={() => router.push('/stats')}>
            Estadísticas
          </Rectangulo2>
        </div>
      </div>
    </div>
  );
}
