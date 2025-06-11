#  100 Halcones Dijeron

Un juego de preguntas al estilo “100 Mexicanos Dijeron”, interactivo en tiempo real usando MQTT + WebSockets y desarrollado con Next.js y Docker.

---

##  Requisitos

- Node.js (v18 o superior recomendado)  
- Docker instalado  
- MySQL (puedes usar Workbench o cualquier gestor)  
- Editor como VS Code  

---

##  Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tuusuario/100halconesdijeron.git
   cd 100halconesdijeron
   ```

2. Navega a la carpeta raíz del proyecto (donde se encuentra el archivo `docker-compose.yml`).

3. Ejecuta el siguiente comando para levantar todos los servicios:

   ```bash
   docker-compose up -d
   ```

4. Abre tu navegador y visita:

   http://localhost:3000

   Ahí deberías ver la aplicación en funcionamiento 🎉

---

## 🐳 Imagen Dockerizada

Este proyecto ya cuenta con una imagen Docker lista para usarse.

---

##  Ejecutar con la imagen Docker ya generada

Si no deseas clonar el repositorio ni construir el proyecto manualmente, puedes ejecutar la aplicación directamente con la imagen publicada en Docker Hub:

1. Asegúrate de tener Docker instalado y ejecutándose.

2. Descarga la imagen desde Docker Hub:

   ```bash
   docker pull normatorales/proyectoweb-web
   ```

3. Ejecuta un contenedor basado en la imagen:

   ```bash
   docker run -d -p 3000:3000 normatorales/proyectoweb-web
   ```

4. Abre tu navegador y visita:

   http://localhost:3000

   ¡Y listo! Ya deberías poder ver la aplicación corriendo 
