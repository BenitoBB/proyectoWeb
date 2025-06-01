DROP DATABASE IF EXISTS halcones;

CREATE DATABASE halcones;
USE halcones;

CREATE TABLE Jugadores (
    jugador_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    tipo ENUM('A', 'B', 'Administrador') NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    puntaje_total INT DEFAULT 0
);

CREATE TABLE Preguntas (
    pregunta_id INT PRIMARY KEY AUTO_INCREMENT,
    texto_pregunta TEXT NOT NULL,
    categoria VARCHAR(50),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE
);

CREATE TABLE Respuestas (
    respuesta_id INT PRIMARY KEY AUTO_INCREMENT,
    pregunta_id INT NOT NULL,
    texto_respuesta VARCHAR(100) NOT NULL,
    puntaje INT NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (pregunta_id) REFERENCES Preguntas(pregunta_id) ON DELETE CASCADE
);

CREATE TABLE Sinonimos (
    sinonimo_id INT PRIMARY KEY AUTO_INCREMENT,
    respuesta_id INT NOT NULL,
    texto_sinonimo VARCHAR(100) NOT NULL,
    FOREIGN KEY (respuesta_id) REFERENCES Respuestas(respuesta_id) ON DELETE CASCADE
);

CREATE TABLE Partidas (
    partida_id INT PRIMARY KEY AUTO_INCREMENT,
    jugadorA_id INT NOT NULL,
    jugadorB_id INT NOT NULL,
    fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATETIME,
    ganador_id INT,
    FOREIGN KEY (jugadorA_id) REFERENCES Jugadores(jugador_id),
    FOREIGN KEY (jugadorB_id) REFERENCES Jugadores(jugador_id),
    FOREIGN KEY (ganador_id) REFERENCES Jugadores(jugador_id)
);

CREATE TABLE Rondas (
    ronda_id INT PRIMARY KEY AUTO_INCREMENT,
    partida_id INT NOT NULL,
    pregunta_id INT NOT NULL,
    numero_ronda INT NOT NULL,
    FOREIGN KEY (partida_id) REFERENCES Partidas(partida_id) ON DELETE CASCADE,
    FOREIGN KEY (pregunta_id) REFERENCES Preguntas(pregunta_id)
);

CREATE TABLE Respuestas_Jugadores (
    respuesta_jugador_id INT PRIMARY KEY AUTO_INCREMENT,
    ronda_id INT NOT NULL,
    jugador_id INT NOT NULL,
    respuesta_id INT,
    texto_respuesta VARCHAR(100) NOT NULL,
    es_correcta BOOLEAN,
    puntaje_obtenido INT,
    FOREIGN KEY (ronda_id) REFERENCES Rondas(ronda_id) ON DELETE CASCADE,
    FOREIGN KEY (jugador_id) REFERENCES Jugadores(jugador_id),
    FOREIGN KEY (respuesta_id) REFERENCES Respuestas(respuesta_id)
);

-- Insertar administrador
INSERT INTO Jugadores (nombre, tipo) VALUES ('Admin Principal', 'Administrador');

-- Insertar jugadores
INSERT INTO Jugadores (nombre, tipo) VALUES ('Jugador 1', 'A'), ('Jugador 2', 'B');

-- Insertar pregunta
INSERT INTO Preguntas (texto_pregunta) 
VALUES ('¿Qué haces si ves un fantasma?');

-- Insertar respuestas (con puntajes que suman 100)
INSERT INTO Respuestas (pregunta_id, texto_respuesta, puntaje, es_principal) VALUES
(1, 'Correr', 40, TRUE),
(1, 'Gritar', 30, TRUE),
(1, 'Asustarse', 20, TRUE),
(1, 'Rezar', 5, FALSE),
(1, 'Ignorarlo', 5, FALSE);

-- Insertar sinónimos
INSERT INTO Sinonimos (respuesta_id, texto_sinonimo) VALUES
(1, 'Huir'), (1, 'Escapar'), (1, 'Salir corriendo'),
(2, 'Chillar'), (2, 'Dar un grito'), (2, 'Vociferar'),
(3, 'Amedrentarse'), (3, 'Atemorizarse'), (3, 'Espantarse'),
(4, 'Orar'), (4, 'Pedir ayuda divina'),
(5, 'No hacer caso'), (5, 'Pasar de largo');

-- Otro ejemplo de pregunta
-- Pregunta sobre comida
INSERT INTO Preguntas (texto_pregunta, categoria) 
VALUES ('¿Cuál es tu comida mexicana favorita?', 'Comida');

-- Respuestas principales (suman 100)
INSERT INTO Respuestas (pregunta_id, texto_respuesta, puntaje, es_principal) VALUES
(2, 'Tacos', 45, TRUE),
(2, 'Mole', 25, TRUE),
(2, 'Enchiladas', 15, TRUE),
(2, 'Chiles en nogada', 10, TRUE),
(2, 'Pozole', 5, TRUE);

-- Sinónimos
INSERT INTO Sinonimos (respuesta_id, texto_sinonimo) VALUES
(6, 'Tacos al pastor'), (6, 'Tacos de suadero'), (6, 'Tacos dorados'),
(7, 'Mole poblano'), (7, 'Mole negro'), (7, 'Mole de olla'),
(8, 'Enchiladas verdes'), (8, 'Enchiladas rojas'), (8, 'Enchiladas suizas'),
(9, 'Chiles poblanos'), (9, 'Chiles rellenos'),
(10, 'Pozole rojo'), (10, 'Pozole verde');

-- Otro ejemplo
-- Pregunta sobre deportes
INSERT INTO Preguntas (texto_pregunta, categoria) 
VALUES ('¿Qué deporte practicas o te gustaría practicar?', 'Deportes');

-- Respuestas principales (suman 100)
INSERT INTO Respuestas (pregunta_id, texto_respuesta, puntaje, es_principal) VALUES
(3, 'Fútbol', 50, TRUE),
(3, 'Béisbol', 20, TRUE),
(3, 'Boxeo', 15, TRUE),
(3, 'Natación', 10, TRUE),
(3, 'Baloncesto', 5, TRUE);

-- Sinónimos
INSERT INTO Sinonimos (respuesta_id, texto_sinonimo) VALUES
(11, 'Soccer'), (11, 'Futbol soccer'), (11, 'Fútbol asociación'),
(12, 'Pelota'), (12, 'Beis'),
(13, 'Box'), (13, 'Pugilismo'),
(14, 'Nadar'), (14, 'Estilo libre'),
(15, 'Básquetbol'), (15, 'Basket');

-- Pregunta sobre viajes
INSERT INTO Preguntas (texto_pregunta, categoria) 
VALUES ('¿A qué lugar te gustaría viajar?', 'Viajes');

-- Respuestas principales (suman 100)
INSERT INTO Respuestas (pregunta_id, texto_respuesta, puntaje, es_principal) VALUES
(4, 'Cancún', 40, TRUE),
(4, 'París', 30, TRUE),
(4, 'Tokio', 15, TRUE),
(4, 'Nueva York', 10, TRUE),
(4, 'Roma', 5, TRUE);

-- Sinónimos
INSERT INTO Sinonimos (respuesta_id, texto_sinonimo) VALUES
(16, 'Riviera Maya'), (16, 'Playa del Carmen'), (16, 'Quintana Roo'),
(17, 'Francia'), (17, 'Torre Eiffel'),
(18, 'Japón'), (18, 'Kioto'),
(19, 'NYC'), (19, 'Manhattan'),
(20, 'Italia'), (20, 'Ciudad Eterna');

-- Pregunta sobre música
INSERT INTO Preguntas (texto_pregunta, categoria) 
VALUES ('¿Qué tipo de música escuchas normalmente?', 'Música');

-- Respuestas principales (suman 100)
INSERT INTO Respuestas (pregunta_id, texto_respuesta, puntaje, es_principal) VALUES
(5, 'Pop', 35, TRUE),
(5, 'Rock', 30, TRUE),
(5, 'Regional Mexicano', 20, TRUE),
(5, 'Electrónica', 10, TRUE),
(5, 'Rap/Hip Hop', 5, TRUE);

-- Sinónimos
INSERT INTO Sinonimos (respuesta_id, texto_sinonimo) VALUES
(21, 'Música popular'), (21, 'Pop contemporáneo'),
(22, 'Rock and roll'), (22, 'Rock clásico'), (22, 'Metal'),
(23, 'Banda'), (23, 'Norteño'), (23, 'Mariachi'),
(24, 'EDM'), (24, 'Dance'), (24, 'House'),
(25, 'Hiphop'), (25, 'Trap');

-- Pregunta hipotética
INSERT INTO Preguntas (texto_pregunta, categoria) 
VALUES ('¿Qué harías si ganas la lotería?', 'Hipotéticas');

-- Respuestas principales (suman 100)
INSERT INTO Respuestas (pregunta_id, texto_respuesta, puntaje, es_principal) VALUES
(6, 'Comprar una casa', 40, TRUE),
(6, 'Viajar por el mundo', 30, TRUE),
(6, 'Ayudar a mi familia', 20, TRUE),
(6, 'Invertir', 5, TRUE),
(6, 'Comprar un coche', 5, TRUE);

-- Sinónimos
INSERT INTO Sinonimos (respuesta_id, texto_sinonimo) VALUES
(26, 'Adquirir una vivienda'), (26, 'Comprar un departamento'),
(27, 'Conocer otros países'), (27, 'Dar la vuelta al mundo'),
(28, 'Apoyar a mis seres queridos'), (28, 'Dar dinero a mi familia'),
(29, 'Poner un negocio'), (29, 'Abrir una empresa'),
(30, 'Adquirir un automóvil'), (30, 'Comprar un carro');