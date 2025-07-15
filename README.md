# Todo List API

Este es un proyecto backend desarrollado con [NestJS](https://nestjs.com/) que permite gestionar usuarios y tareas (todos). Incluye autenticación con JWT, roles, validaciones y pruebas con Jest.

## Características

-   Registro y login de usuarios
-   Protección de rutas con JWT
-   Gestión de tareas (crear, obtener, actualizar, eliminar)
-   Pruebas unitarias y de integración con cobertura alta
-   Organización modular por carpetas
-   Uso de TypeORM y PostgreSQL

## Requisitos

-   Node.js >= 18
-   PostgreSQL
-   Yarn

## Instalación

1. Clona el repositorio: `git clone https://github.com/AntonioJRM1998/todo-list-bug.git` y entra en la carpeta: `cd todo-list-bug`. Instala las dependencias con `yarn install`. Configura el entorno creando un archivo `.env` en la raíz con las variables `DATABASE_URL=postgres://usuario:contraseña@localhost:5432/nombre_de_tu_db` y `JWT_SECRET=un_secreto_seguro` (reemplaza con tus datos). Ejecuta las migraciones con `yarn prisma migrate dev --name init` y carga datos de ejemplo con `yarn seed`. Finalmente, inicia el servidor en modo desarrollo con `yarn start:dev`. La API estará disponible en `http://localhost:3000`.

## Colección de Postman

Utiliza el archivo `todo-list.postman_collection.json` incluido para probar los endpoints de forma sencilla, incluyendo autenticación y gestión de tareas.

## Scripts útiles

Para ejecutar pruebas usa `yarn test`, para ver cobertura `yarn test:cov`, para generar migraciones `yarn prisma migrate dev --name nombre` y para ejecutar el seeder manualmente `yarn seed`.

## Estructura del proyecto

El código está organizado en carpetas principales dentro de `src/`: `module/` con `users` y `tasks`, y `shared/` que contiene `auth`, `decorators`, `dtos`, `entities`, `guard` y `constants.ts`. El punto de entrada es `main.ts` y el módulo principal `app.module.ts`.

## Licencia

MIT
