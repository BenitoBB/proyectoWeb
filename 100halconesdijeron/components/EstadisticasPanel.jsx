//components/EstadisticasPanel.jsx

import { useEffect, useState } from 'react';

export default function EstadisticasPanel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) return <p>Cargando estadísticas...</p>;

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1rem' }}>
      <div style={cuadro}>
        <h3>Total de Juegos</h3>
        <p>{stats.total_juegos}</p>
      </div>
      <div style={cuadro}>
        <h3>Juegos Completados</h3>
        <p>{stats.juegos_completados}</p>
      </div>
      <div style={cuadro}>
        <h3>Rondas Totales</h3>
        <p>{stats.rondas_totales}</p>
      </div>
      <div style={cuadro}>
        <h3>Promedio de Rondas</h3>
        <p>{stats.rondas_promedio_por_juego}</p>
      </div>
      <div style={cuadro}>
        <h3>Tiempo Promedio</h3>
        <p>{stats.tiempo_promedio_por_juego}</p>
      </div>
      <div style={cuadro}>
        <h3>Respuesta más común</h3>
        <p>{stats.respuesta_mas_comun}</p>
      </div>
    </div>
  );
}

const cuadro = {
  backgroundColor: '#f3f3f3',
  padding: '1rem',
  borderRadius: '8px',
  width: '250px',
  textAlign: 'center',
  boxShadow: '0 0 5px rgba(0,0,0,0.1)'
};
