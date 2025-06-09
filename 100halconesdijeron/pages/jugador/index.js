//pages/jugador/index.js

'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import SalaEspera from '@/componentes/SalaEspera';

export default function JugadorPage() {
  const searchParams = useSearchParams();
  const rol = searchParams.get('rol');
  const [listo, setListo] = useState(false);

  if (!rol || !['jugadorA', 'jugadorB'].includes(rol?.trim())) {
    return <p>Debes especificar el rol: jugadorA o jugadorB</p>;
  }



  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Espera...</h1>
      <SalaEspera rol={rol} setListoGlobal={setListo} />
    </div>
  );
}
