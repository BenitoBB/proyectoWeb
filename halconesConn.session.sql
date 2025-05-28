-- Tabla de preguntas
CREATE TABLE preguntas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  texto VARCHAR(255) NOT NULL
);

-- Tabla de respuestas
CREATE TABLE respuestas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pregunta_id INTEGER NOT NULL,
  texto VARCHAR(255) NOT NULL,
  puntos INTEGER NOT NULL,
  FOREIGN KEY (pregunta_id) REFERENCES preguntas(id)
);

-- Tabla de sinónimos
CREATE TABLE sinonimos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  respuesta_id INTEGER NOT NULL,
  texto VARCHAR(255) NOT NULL,
  FOREIGN KEY (respuesta_id) REFERENCES respuestas(id)
);

INSERT INTO preguntas (texto) VALUES ('¿Qué haces en tu cumpleaños?');
INSERT INTO respuestas (pregunta_id, texto, puntos) VALUES (1, 'Comer pastel', 40);
INSERT INTO respuestas (pregunta_id, texto, puntos) VALUES (1, 'Recibir regalos', 30);
INSERT INTO respuestas (pregunta_id, texto, puntos) VALUES (1, 'Festejar', 20);

INSERT INTO sinonimos (respuesta_id, texto) VALUES (1, 'pastel');
INSERT INTO sinonimos (respuesta_id, texto) VALUES (1, 'tarta');
INSERT INTO sinonimos (respuesta_id, texto) VALUES (1, 'pastelito');
