// ------------------------------
// 📁 pages/index.js
// Página de inicio de la aplicación
// ------------------------------
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('player');
  const router = useRouter();

  const handleJoin = () => {
    if (!name) return;
    router.push(`/${role}?name=${encodeURIComponent(name)}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>100 Halcones Dijeron</h1>
      <input
        type="text"
        placeholder="Tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="player">Jugador</option>
        <option value="admin">Administrador</option>
      </select>
      <button onClick={handleJoin}>Entrar</button>
    </div>
  );
}