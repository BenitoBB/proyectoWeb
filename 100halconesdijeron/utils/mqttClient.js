'use client';

import { useEffect, useRef } from 'react';
import Paho from 'paho-mqtt';

export function useMQTT(topic, onMessageCallback) {
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new Paho.Client('broker.hivemq.com', 8000, `clientId-${Math.random()}`);
    clientRef.current = client;

    client.onConnectionLost = (responseObject) => {
      console.error('MQTT: Conexión perdida', responseObject.errorMessage);
    };

    client.onMessageArrived = (message) => {
      const payload = message.payloadString;
      onMessageCallback(payload, message);
    };

    client.connect({
      onSuccess: () => {
        console.log('MQTT: Conectado');
        client.subscribe(topic);
      },
      onFailure: (err) => {
        console.error('MQTT: Error de conexión', err);
      }
    });

    return () => {
      if (client && client.isConnected()) {
        client.disconnect();
        console.log('MQTT: Desconectado');
      }
    };
  }, [topic]);

  const sendMessage = (payload, destinationTopic = topic) => {
    if (clientRef.current?.isConnected()) {
      const message = new Paho.Message(payload);
      message.destinationName = destinationTopic;
      clientRef.current.send(message);
    } else {
      console.warn('MQTT: Cliente no conectado aún');
    }
  };

  return { sendMessage };
}
