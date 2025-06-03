//pages/index.js

'use client';

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
    
    <div>
      <div
        style={{
        minHeight: "100vh",
        backgroundImage: "url('/fondo.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", 
        padding: "20px",
      }}>

        {/* Titulo del Juego 100HALCONESDIJERON */}
        <img
          src="/titulo.png"
          alt="100 HALCONES DIJERON"
          style={{
            display: "block",
            margin: "0 auto",
            marginTop: "2rem",
            maxWidth: "90%",
            height: "auto",
          }}
        />

        <div style={{ marginTop: "20px", width: "100%", textAlign: "center" }} className={openSans.className}>
          <Pregunta texto="Un juego interactivo en tiempo real con WebSocket + MQTT" />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row", 
            alignItems: "center", 
            gap: "30px",          
            marginTop: "30px",    
            justifyContent: 'center', 
            width: 'fit-content', 
            maxWidth: '90%', 
          }}>
            <Rectangulo onClick={() => router.push('/jugador?name=JugadorA&rol=jugadorA')}>Jugador A</Rectangulo>
            <Rectangulo onClick={() => router.push('/jugador?name=JugadorB&rol=jugadorB')}>Jugador B</Rectangulo>
            <Rectangulo2 onClick={() => router.push('/admin')}>Administrador</Rectangulo2>
            <Rectangulo2 onClick={() => router.push('/admin/stats')}>Estadísticas</Rectangulo2>
          </div>

      </div>
    </div>
  );
}