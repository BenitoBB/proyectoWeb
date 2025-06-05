import { TOPICS } from "@/utils/constants";

let ganadorDuelo = null; // Se reinicia con cada ronda

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { jugador } = req.body;

  if (!ganadorDuelo) {
    ganadorDuelo = jugador;
    // NO publicar aquí por MQTT
    res.status(200).json({ ganador: jugador });
  } else {
    res.status(200).json({ ganador: ganadorDuelo });
  }
}

export function resetGanadorDuelo() {
  ganadorDuelo = null;
}