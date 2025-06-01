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
    
    <div style={styles.container}>

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
            <Rectangulo onClick={() => router.push('/jugador/indexJugador')}>Jugador A</Rectangulo>
            <Rectangulo onClick={() => router.push('/jugador/indexJugador')}>Jugador B</Rectangulo>
            <Rectangulo2 onClick={() => router.push('/admin/indexAdmin')}>Administrador</Rectangulo2>
            <Rectangulo2 onClick={() => router.push('/admin/stats')}>Estadísticas</Rectangulo2>
          </div>





      </div>
      <h1 style={styles.title}>🎉 100 Halcones Dijeron 🎉</h1>
      <p style={styles.description}>Un juego interactivo en tiempo real con WebSocket + MQTT</p>

      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => router.push('/jugador?name=JugadorA&rol=jugadorA')}
        >
          Ingresar como Jugador A
        </button>
        <button
          style={styles.button}
          onClick={() => router.push('/jugador?name=JugadorB&rol=jugadorB')}
        >
          Ingresar como Jugador B
        </button>
        <button
          style={{ ...styles.button, backgroundColor: '#28a745' }}
          onClick={() => router.push('/admin')}
        >
          Entrar como Administrador
        </button>
        <button
          style={{ ...styles.button, backgroundColor: '#6c757d' }}
          onClick={() => router.push('/admin/stats')}
        >
          Ver estadísticas
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    fontWeight: 'bold'
  },
  description: {
    fontSize: '1.2rem',
    marginBottom: '2rem'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  }
};
