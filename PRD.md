# Project Requirements Document (PRD): PhishMaster Pro (el nombre no va a ser este, va a ser otro, si se te ocurre uno mejor, dimelo)

## 1. Definición del Producto
Plataforma web educativa para la simulación de ataques de ingeniería social multiplataforma (Email, SMS, WhatsApp) y análisis de cargas útiles. Diseñada con arquitectura Full-Stack para demostraciones en vivo en charlas de ciberseguridad.

## 2. Arquitectura Técnica (Tech Stack)
* **Backend:** Python con FastAPI.
* **Frontend:** React (Vite) con Tailwind CSS.
* **Base de Datos:** SQLite (ligera y local para facilitar el despliegue).

## 3. Alcance de Simulación (Módulos)
* **Módulo Email:** Interfaz de cliente de correo con cabeceras expandibles y simulación de "hover" en enlaces (muestra una URL falsa en la parte inferior).
* **Módulo Mobile (SMS/WhatsApp):** Interfaz que simula la pantalla de un smartphone para notificaciones y chats.
* **Módulo de Archivos (Payloads):** Visor de adjuntos para analizar extensiones dobles o ejecutables camuflados.

## 4. Dinámica de Uso y Dificultad (Modo Presentador)
* **Panel de Control:** Acceso para el presentador que permite seleccionar directamente el Escenario (Email/SMS/Archivo) y Nivel (Fácil/Medio/Difícil).
* **Dificultad Progresiva:**
    * *Fácil:* Faltas de ortografía, premios irreales, extensiones obvias (.exe).
    * *Medio:* Suplantación básica (ej. support@g00gle.com), notificaciones de paquetería.
    * *Difícil:* Gramática perfecta, spear phishing interno, urgencia psicológica, dominios homógrafos.

## 5. Sistema de Aprendizaje (Escáner de Rayos X)
* Al revelar la solución, la interfaz se oscurece (capa semitransparente).
* Se iluminan los "puntos calientes" del ataque (remitente, enlaces, tono de urgencia).
* Al hacer clic en estos puntos, aparecen burbujas de texto con explicaciones técnicas pero accesibles sobre el vector de ataque.