// utils/serverMqtt.js
import mqtt from 'mqtt';

let client = null;

export function mqttSendMessage(topic, payload) {
  if (!client) {
    client = mqtt.connect('mqtt://localhost:1883'); // Cambia si usas otro host
    client.on('connect', () => {
      console.log('🟢 Backend MQTT conectado');
      client.publish(topic, payload);
    });
    client.on('error', (err) => {
      console.error('❌ Error en MQTT servidor:', err);
    });
  } else {
    client.publish(topic, payload);
  }
}
