'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegistroPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [rol, setRol] = useState('jugadorA');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      router.push(`/jugador?name=${encodeURIComponent(name)}&rol=${rol}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👤 Registro de Jugador</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Escribe tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <select
          value={rol}
          onChange={e => setRol(e.target.value)}
          style={styles.input}
        >
          <option value="jugadorA">Jugador A</option>
          <option value="jugadorB">Jugador B</option>
        </select>
        <button type="submit" style={styles.button}>Entrar al juego</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#f1f1f1'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    width: '250px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};
