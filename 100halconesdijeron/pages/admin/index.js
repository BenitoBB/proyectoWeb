//pages/admin/page.js

'use client';

import { useState } from 'react';
import SalaEspera from '@/componentes/SalaEspera';

export default function AdminPage() {
  const [listo, setListo] = useState(false);

  return (
    <div>
      <h1>Administrador</h1>
      <SalaEspera rol="admin" setListoGlobal={setListo} />
    </div>
  );
}
