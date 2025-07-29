# [WitcherBot](https://discord.com/oauth2/authorize?client_id=1099725174280048741&permissions=8&integration_type=0&scope=bot+applications.commands) 🧙‍♂️

**[WitcherBot](https://discord.com/oauth2/authorize?client_id=1099725174280048741&permissions=8&integration_type=0&scope=bot+applications.commands)** es un bot multifuncional para Discord, diseñado con un enfoque modular y extensible. Su objetivo es ofrecer una solución todo-en-uno para la administración de servidores, entretenimiento de comunidades, gestión económica virtual y más.

---

## Tabla de Contenido

- [🚀 Características principales](#-características-principales)
  - [🔧 Comandos con prefijo y Slash Commands](#-comandos-con-prefijo-y-slash-commands)
  - [🛡️ Administración](#-administración)
  - [🎵 Música](#-música)
  - [🤑 Economía Virtual](#-economía-virtual)
  - [🎲 Entretenimiento](#-entretenimiento)
- [🌐 Panel Web](#-panel-web)
- [⚙️ Tecnologias utilizadas](#%EF%B8%8F-tecnologías-utilizadas)
  - [🧑‍💻 NPM](#-npm)

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
### 🧑‍💻 NPM
- - **Node.js** + **Discord.js**: Núcleo del bot y manejo de interacciones con Discord.
- - **firebase** y **firebase-admin**: Base de datos NoSQL y servicios de backend.
- - **@iamtraction/google-translate** para funcionalidades de traducción.
- - **poru** para la reproducción de música.
- - **express** + **passport**: para la creacion del servidor web y el inicio de sesion con Discord
