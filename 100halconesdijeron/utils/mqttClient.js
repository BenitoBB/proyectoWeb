// ------------------------------
// 📁 utils/mqttClient.js
// Utilidad para manejar la conexión MQTT y el envío/recepción de mensajes.
// ------------------------------
import { useEffect, useRef } from 'react';
import Paho from 'paho-mqtt';

export function useMQTT(topic, onMessageCallback) {
  const clientRef = useRef(null);

  useEffect(() => {
    const clientId = 'client_' + Math.random().toString(16).substr(2, 8);
    const client = new Paho.Client('localhost', 9001, clientId); // Cambia el host y puerto si es necesario

    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.error('MQTT connection lost:', responseObject.errorMessage);
      }
    };

    client.onMessageArrived = (message) => {
      console.log('MQTT message received:', message.payloadString);
      if (onMessageCallback) onMessageCallback(message);
    };

    client.connect({
      onSuccess: () => {
        console.log('MQTT connected');
        client.subscribe(topic);
      },
      onFailure: (error) => {
        console.error('MQTT connection failed:', error);
      },
    });

    clientRef.current = client;

    return () => {
      client.disconnect();
    };
  }, [topic]);

  const sendMessage = (messageText) => {
    const message = new Paho.Message(messageText);
    message.destinationName = topic;
    clientRef.current?.send(message);
  };

  return { sendMessage };
}
