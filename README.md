# [WitcherBot](https://discord.com/oauth2/authorize?client_id=1099725174280048741&permissions=8&integration_type=0&scope=bot+applications.commands) 🧙‍♂️

**[WitcherBot](https://discord.com/oauth2/authorize?client_id=1099725174280048741&permissions=8&integration_type=0&scope=bot+applications.commands)** es un bot multifuncional para Discord, diseñado con un enfoque modular y extensible. Su objetivo es ofrecer una solución todo-en-uno para la administración de servidores, entretenimiento de comunidades, gestión económica virtual y más.

---

## Tabla de Contenido

## Tabla de Contenido

- [🚀 Características principales](#-características-principales)
  - [🔧 Comandos con prefijo y Slash Commands](#-comandos-con-prefijo-y-slash-commands)
  - [🛡️ Administración](#-administración)
  - [🎵 Música](#-música)
  - [🤑 Economía Virtual](#-economía-virtual)
  - [🎲 Entretenimiento](#-entretenimiento)
- [🌐 Panel Web](#-panel-web)
- [⚙️ Tecnologías utilizadas](#%EF%B8%8Ftecnologías-utilizadas)
  - [🧑‍💻 Backend y Bot](#%E2%80%8D-backend-y-bot)
  - [☁️ Base de datos y servicios](#-base-de-datos-y-servicios)
  - [🌍 Funcionalidades extra](#-funcionalidades-extra)
  - [🌐 Servidor web y autenticación](#-servidor-web-y-autenticación)
  - [🎨 Estilos y frontend](#-estilos-y-frontend)

---

## 🚀 Características principales

### 🔧 Comandos con prefijo y Slash Commands
[WitcherBot](https://discord.com/oauth2/authorize?client_id=1099725174280048741&permissions=8&integration_type=0&scope=bot+applications.commands) soporta dos métodos de interacción:
- **Prefijos personalizados**, definidos por servidor (Por defecto se usa el prefijo <<).
- **Slash commands (`/`)**, registrados dinámicamente con Discord API para mejor integración y UX.

### 🛡️ Administración
- Sistema de moderación (kick, ban, mute, warn).
- Logs de eventos configurables.
- Auto-roles y sistema de verificación.

### 🎵 Música
- Reproducción de música desde múltiples fuentes.
- Comandos como play, skip, queue, volume, pause, etc.
- Control vía comandos o panel web (próximamente).

### 🤑 Economía Virtual
- Sistema de monedas, trabajos, niveles y recompensas.
- Tienda, perfil de usuario, e inventario.
- Interacciones sociales (donar, robar, apostar).

### 🎲 Entretenimiento
- Comandos de interacción.
- Juegos simples (dados, piedra papel tijera, trivia).
- Generadores de contenido humorístico.

---

## 🌐 [Panel Web](https://witcherbot.up.railway.app/login)

WitcherBot contará con un **dashboard web** que permitirá:
- Gestionar módulos y configuración por servidor.
- Ver estadísticas de uso.
- Administrar permisos y roles asignados al bot.

> La interfaz web está siendo desarrollada en paralelo y estará disponible en próximas versiones.

---

## ⚙️ Tecnologías utilizadas
### 🧑‍💻 Backend y Bot
- Node.js + Discord.js → Núcleo del bot y conexión con la API de Discord.
- dotenv → Manejo seguro de variables de entorno.
- nodemon → Recarga automática en desarrollo.
### ☁️ Base de datos y servicios
- firebase + firebase-admin → Base de datos NoSQL y servicios de backend en la nube.
### 🌍 Funcionalidades extra
- @iamtraction/google-translate → Traducción de mensajes en tiempo real.
- poru → Cliente Lavalink para reproducción de música.
### 🌐 Servidor web y autenticación
- express → Framework para crear el servidor web.
- express-handlebars → Motor de plantillas para las vistas.
- express-session → Manejo de sesiones de usuario.
- passport + passport-discord → Autenticación OAuth2 con Discord.
### 🎨 Estilos y frontend
- tailwindcss → Framework de estilos CSS.
- @tailwindcss/cli → Herramienta de compilación de Tailwind.
- @tailwindplus/elements → Componentes listos para usar con Tailwind.