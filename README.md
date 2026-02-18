# NEXO_TIC (Frontend)

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)

## ÍNDICE
- [NEXO\_TIC (Frontend)](#nexo_tic-frontend)
  - [ÍNDICE](#índice)
  - [DESCRIPCIÓN](#descripción)
  - [VARIABLES DE ENTORNO](#variables-de-entorno)
  - [INSTALACIÓN](#instalación)
  - [DESPLIEGUE](#despliegue)
    - [Local](#local)
    - [Docker](#docker)
  - [TESTING](#testing)
    - [Ejecutar Tests](#ejecutar-tests)
    - [CI/CD Automático](#cicd-automático)
    - [Más Información](#más-información)

## DESCRIPCIÓN

Frontend del sistema de gestión empresarial **NEXO_TIC**. Aplicación SPA (Single Page Application) construida con React, TypeScript y Vite que proporciona interfaces para:

- **Autenticación:** Login, Registro, Recuperación de contraseña
- **Gestión de Empleados:** Vacaciones, incidencias, solicitudes
- **Recursos Humanos:** Aprobaciones, avisos, reportes, gestión de empleados
- **Dashboard:** Panel de control personalizado por rol

## VARIABLES DE ENTORNO

En la raíz del proyecto crea un archivo `.env` y define las variables de entorno necesarias.

| Clave | Valor por defecto | Descripción |
| - | - | - |
| `VITE_API_URL` | `"http://localhost:8000/"` | URL base del backend API |

> [!NOTE]
> Las variables de entorno en Vite deben tener el prefijo `VITE_` para ser accesibles en el cliente.

## INSTALACIÓN

1. Instalación de dependencias
   ```bash
   npm i
   ```

## DESPLIEGUE

### Local

Inicia el servidor de desarrollo, este se encuentra en el puerto __5173__ por defecto.

```bash
npm run dev
```

Para construir la versión de producción:

```bash
npm run build
```

Para previsualizar la build de producción localmente:

```bash
npm run preview
```

### Docker

Crea la imagen del proyecto
```bash
docker build -t app_frontend .
```

Crea un contenedor de la imagen previamente construida.
```bash
docker run -d --name app_frontend_container -p 80:80 app_frontend
```

## TESTING

El proyecto incluye una suite completa de tests usando **Vitest** y **Testing Library** con cobertura de:

- ✅ Componentes UI
- ✅ Hooks personalizados
- ✅ Contextos (Auth)
- ✅ Utilidades
- ✅ Servicios API

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Tests con interfaz gráfica
npm run test:ui

# Generar reporte de coverage
npm run test:coverage
```

### CI/CD Automático

Los tests se ejecutan automáticamente en **GitHub Actions** cuando:
- Se hace push a `dev` o `main`
- Se crea un Pull Request hacia `dev` o `main`

### Más Información

Para detalles completos sobre testing, debugging, y flujo de trabajo CI/CD, consulta [TESTING.md](./TESTING.md).
