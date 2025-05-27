'use client';

import { useEffect, useRef } from 'react';
import Paho from 'paho-mqtt';

let globalClient = null;
const subscribers = {};

export function useMQTT(topic, onMessageCallback) {
  const topicRef = useRef(topic);

  useEffect(() => {
    if (!globalClient) {
      const clientId = 'client-' + Math.random().toString(16).slice(2);
      globalClient = new Paho.Client('localhost', 9001, '/', clientId);
      window.globalClient = globalClient; // 👈 necesario para acceso global

      globalClient.onConnectionLost = () => console.warn('MQTT: conexión perdida');

      globalClient.onMessageArrived = (message) => {
        const { destinationName: topic, payloadString } = message;
        if (subscribers[topic]) {
          subscribers[topic].forEach((cb) => cb(payloadString, topic));
        }
      };

      globalClient.connect({
        onSuccess: () => {
          console.log('MQTT: conectado');
          Object.keys(subscribers).forEach((t) => {
            globalClient.subscribe(t);
            console.log('🟢 Suscrito a:', t);
          });
        },
        onFailure: (err) => console.error('MQTT error al conectar', err)
      });
    }

    // Registrar el nuevo suscriptor
    if (!subscribers[topicRef.current]) {
      subscribers[topicRef.current] = [];
    }

    if (globalClient && globalClient.isConnected()) {
      globalClient.subscribe(topicRef.current);
    }

    subscribers[topicRef.current].push(onMessageCallback);

    return () => {
      subscribers[topicRef.current] = subscribers[topicRef.current].filter(cb => cb !== onMessageCallback);
    };
  }, [onMessageCallback]);

  const sendMessage = (topic, payload) => {
    if (globalClient && globalClient.isConnected()) {
      const message = new Paho.Message(payload);
      message.destinationName = topic;
      globalClient.send(message);
    } else {
      console.warn('MQTT: no conectado aún');
    }
  };

  return { sendMessage };
}

export function useMQTTClient() {
  return globalClient;
}