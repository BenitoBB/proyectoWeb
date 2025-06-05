/**
 * Recibe la respuesta y el jugador.
 * Valida si la respuesta es la más famosa.
 * Publica el turno y el estado del tablero por MQTT.
 * Devuelve el resultado al frontend.
 */

import db from "@/lib/db";
import { mqttSendMessage } from "@/utils/serverMqtt";
import { TOPICS } from "@/utils/constants";

let respuestasAcertadas = []; // Se reinicia con cada ronda
let turnoActual = null; // Se reinicia con cada ronda

let estadoDuelo = {
  enDuelo: true,
  primerJugador: null,
  primerRespuesta: null,
  primerPuntaje: null,
  segundoJugador: null,
  segundoRespuesta: null,
  segundoPuntaje: null,
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { jugador, respuesta, preguntaId } = req.body;

  // Obtener respuestas válidas de la pregunta
  const [respuestas] = await db.query(
    "SELECT * FROM Respuestas WHERE pregunta_id = ? ORDER BY puntaje DESC",
    [preguntaId]
  );

  // Normaliza la respuesta del jugador
  const limpia = respuesta.trim().toLowerCase();

  // Busca si la respuesta es válida y no ha sido acertada antes
  let respuestaCorrecta = null;
  for (const r of respuestas) {
    if (
      r.texto_respuesta.toLowerCase() === limpia &&
      !respuestasAcertadas.includes(r.texto_respuesta)
    ) {
      respuestaCorrecta = r;
      break;
    }
  }

  let esMasFamosa = false;
  let mensaje = "";
  // Solo procesa si el jugador es el que tiene el turno
  if (turnoActual && jugador !== turnoActual) {
    return res.status(200).json({
      acertada: false,
      esMasFamosa: false,
      turno: turnoActual,
      mensaje: "No es tu turno.",
      respuestasAcertadas,
    });
  } else if (respuestaCorrecta) {
    respuestasAcertadas.push(respuestaCorrecta.texto_respuesta);

    // ¿Es la más famosa? (mayor puntaje)
    const maxPuntaje = Math.max(...respuestas.map(r => r.puntaje));
    esMasFamosa = respuestaCorrecta.puntaje === maxPuntaje;

    // --- DUEL DE RAPIDEZ ---
    if (estadoDuelo.enDuelo) {
      if (!estadoDuelo.primerJugador) {
        // Primer jugador responde
        estadoDuelo.primerJugador = jugador;
        estadoDuelo.primerRespuesta = respuestaCorrecta ? respuestaCorrecta.texto_respuesta : null;
        estadoDuelo.primerPuntaje = respuestaCorrecta ? respuestaCorrecta.puntaje : 0;

        if (respuestaCorrecta && esMasFamosa) {
          estadoDuelo.enDuelo = false;
          turnoActual = jugador;
          mensaje = "¡Correcto! Es la respuesta más famosa. Sigues jugando.";
        } else {
          // Pasa el turno al otro jugador
          turnoActual = jugador === "Jugador A" ? "Jugador B" : "Jugador A";
          mensaje = "¡Correcto! Pero no es la más famosa. Turno para el otro jugador.";
        }
      } else if (!estadoDuelo.segundoJugador && jugador !== estadoDuelo.primerJugador) {
        // Segundo jugador responde
        estadoDuelo.segundoJugador = jugador;
        estadoDuelo.segundoRespuesta = respuestaCorrecta ? respuestaCorrecta.texto_respuesta : null;
        estadoDuelo.segundoPuntaje = respuestaCorrecta ? respuestaCorrecta.puntaje : 0;

        if (respuestaCorrecta && estadoDuelo.segundoPuntaje > estadoDuelo.primerPuntaje) {
          estadoDuelo.enDuelo = false;
          turnoActual = jugador;
          mensaje = "¡Correcto! Superaste la respuesta anterior. Ahora tienes el turno.";
        } else {
          estadoDuelo.enDuelo = false;
          turnoActual = estadoDuelo.primerJugador;
          mensaje = "No superaste la respuesta anterior. El turno regresa al primer jugador.";
        }
      } else {
        // No debe responder nadie más en el duelo
        return res.status(200).json({
          acertada: false,
          esMasFamosa: false,
          turno: turnoActual,
          mensaje: "No es tu turno.",
          respuestasAcertadas,
        });
      }
    } else {
      // --- FLUJO NORMAL DESPUÉS DEL DUELO ---
      if (esMasFamosa) {
        turnoActual = jugador; // Mantiene el turno
        mensaje = "¡Correcto! Es la respuesta más famosa. Sigues jugando.";
      } else {
        // Cambia el turno al otro jugador
        turnoActual = jugador === "Jugador A" ? "Jugador B" : "Jugador A";
        mensaje = "¡Correcto! Pero no es la más famosa. Turno para el otro jugador.";
      }
    }
  } else {
    // Respuesta incorrecta o repetida
    turnoActual = jugador === "Jugador A" ? "Jugador B" : "Jugador A";
    mensaje = "Respuesta incorrecta o ya fue respondida. Turno para el otro jugador.";
  }

  // Publicar el turno y el tablero por MQTT
  mqttSendMessage(TOPICS.TURNO_RAPIDO, turnoActual);
  mqttSendMessage(TOPICS.ESTADO_TABLERO, JSON.stringify({ respuestasAcertadas }));

  res.status(200).json({
    acertada: !!respuestaCorrecta,
    esMasFamosa,
    turno: turnoActual,
    mensaje,
    respuestasAcertadas,
  });
}

// Función para reiniciar el estado al iniciar una nueva ronda
export function resetTableroYTurno() {
  respuestasAcertadas = [];
  turnoActual = null;
  estadoDuelo = {
    enDuelo: true,
    primerJugador: null,
    primerRespuesta: null,
    primerPuntaje: null,
    segundoJugador: null,
    segundoRespuesta: null,
    segundoPuntaje: null,
  };
}