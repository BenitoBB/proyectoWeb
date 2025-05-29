'use client';

export default function Strikes({ cantidad = 0 }) {
  return (
    <div className="flex items-center gap-2 py-2">
      <img
        src="/strikes.png"
        alt="Strikes"
        className="w-32 object-contain"
      />
      <span className="text-2xl font-bold text-red-600">{cantidad}</span>
    </div>
  );
}