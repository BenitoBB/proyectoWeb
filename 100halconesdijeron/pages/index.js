//pages/index.js

'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎉 100 Halcones Dijeron 🎉</h1>
      <p style={styles.description}>Un juego interactivo en tiempo real con WebSocket + MQTT</p>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => router.push('/registro')}>
          Ingresar como Jugador
        </button>
        <button style={{ ...styles.button, backgroundColor: '#28a745' }} onClick={() => router.push('/admin')}>
          Entrar como Administrador
        </button>
        <button style={{ ...styles.button, backgroundColor: '#6c757d' }} onClick={() => router.push('/admin/estadisticas')}>
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
