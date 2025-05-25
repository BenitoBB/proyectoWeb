// pages/index.js
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">100 Halcones Dijeron</h1>
      <button
        onClick={() => router.push('/registro')}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Entrar como Jugador
      </button>
      <button
        onClick={() => router.push('/admin')}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Entrar como Administrador
      </button>
    </div>
  );
}
