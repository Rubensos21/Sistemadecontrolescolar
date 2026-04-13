# Sistema de Control Escolar

## Descripción
Este proyecto es una aplicación web full-stack diseñada para la gestión de alumnos y sus calificaciones (basada en el [diseño original de Figma](https://www.figma.com/design/pofAYwODbjJJapKSZ8gwr0/Sistema-de-Control-Escolar)). Fue construido separando claramente la interfaz de usuario (Front-end) de la lógica de negocio (Back-end) para permitir escalabilidad y mejor organización del código.

- **Frontend**: Una Single Page Application (SPA) moderna construida con **React, Vite y Tailwind CSS**, que proporciona una experiencia de usuario ágil mediante un dashboard interactivo. Incluye vistas para listar estudiantes, consultar y registrar calificaciones, ver reportes e importar información.
- **Backend**: Una API REST robusta construida sobre **Node.js, Express y TypeScript**. Opera bajo una base de datos embebida mediante **SQLite**, gestionada con el ORM **Sequelize**, y garantizando la integridad de datos a través de **Zod**.

## Requisitos Previos
- Node.js (preferentemente v18 o superior).
- npm, yarn o pnpm para el manejo de paquetes.

---

## Cómo Ejecutar el Proyecto

El proyecto está dividido en dos carpetas principales que se deben ejecutar simultáneamente (cada una en su propia terminal). 

### 1. Iniciar el Backend (Servidor)
El servidor utiliza SQLite. La base de datos (`database.sqlite`) se autoconfigura y sincroniza en cuanto inicias el proyecto por primera vez.

1. Abre tu terminal e ingresa a la carpeta del servidor:
   ```bash
   cd server
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Levanta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
> El servidor te indicará en la consola que está escuchando en el puerto `3000` (y si hubo una conexión exitosa a la base de datos). 

### 2. Iniciar el Frontend (Cliente UI)
El frontend ya está configurado para consumir los recursos de la API directamente llamando al puerto `3000` de tu backend local.

1. Abre una **nueva ventana o pestaña** en la terminal y navega a la carpeta principal:
   ```bash
   cd frontend
   ```
2. Instala las dependencias de la interfaz:
   ```bash
   npm install
   ```
3. Inicia el entorno en vivo de Vite:
   ```bash
   npm run dev
   ```
> Esto inicializará la interfaz generalmente en `http://localhost:5173`. Abre la ruta indicada en la terminal desde cualquier navegador web para comenzar a utilizar el sistema.