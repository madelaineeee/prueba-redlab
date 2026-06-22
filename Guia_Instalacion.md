# Guía de Instalación y Ejecución

Esta guía describe los pasos necesarios para ejecutar el proyecto localmente.

---

# Requisitos Previos

Antes de ejecutar el sistema, asegúrese de tener instalados los siguientes programas:

## 1. Git

Permite clonar el repositorio.

Descargar desde:

https://git-scm.com/downloads

Para verificar la instalación:

```bash
git --version
```

---

## 2. .NET 8 SDK

Necesario para ejecutar el backend.

Descargar desde:

https://dotnet.microsoft.com/download/dotnet/8.0

Para verificar la instalación:

```bash
dotnet --version
```

Debe mostrar una versión 8.x.

---

## 3. Node.js

Necesario para ejecutar el frontend.

Descargar desde:

https://nodejs.org

Para verificar la instalación:

```bash
node --version
npm --version
```

---

## 4. Docker Desktop

Necesario para ejecutar SQL Server mediante contenedores.

Descargar desde:

https://www.docker.com/products/docker-desktop/

Verificar instalación:

```bash
docker --version
docker compose version
```

---

# Ejecución del Proyecto

## Paso 1. Clonar el repositorio

Abra una terminal y ejecute:

```bash
git clone https://github.com/madelaineeee/prueba-redlab.git
cd prueba-redlab
```

---

## Paso 2. Iniciar la base de datos

Antes de ejecutar docker compose up -d, asegúrese de que Docker Desktop esté abierto y en ejecución.

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Verificar que el contenedor esté ejecutándose:

```bash
docker ps
```

---

## Paso 3. Ejecutar el Backend

Abrir una nueva terminal.

```bash
cd backend/GestionProductos.API
dotnet run
```

Cuando finalice el inicio, la API estará disponible en:

```text
http://localhost:5219
```

Documentación Swagger:

```text
http://localhost:5219/swagger
```

---

## Paso 4. Ejecutar el Frontend

Abrir una nueva terminal.

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

---

## Paso 5. Acceder al Sistema

Abrir el navegador y visitar:

```text
http://localhost:3000
```

Credenciales de prueba:

```text
Correo: admin@demo.com
Contraseña: Admin123!
```

---

# Solución de Problemas

## Docker no inicia

Verifique que Docker Desktop esté abierto y en ejecución.

---

## Error de conexión a la base de datos

Ejecute:

```bash
docker ps
```

y confirme que SQL Server está activo.

---

## Error al ejecutar el frontend

Eliminar la carpeta `node_modules` y volver a ejecutar:

```bash
npm install
```

---

## Error al ejecutar el backend

Verificar que esté instalado .NET 8:

```bash
dotnet --version
```

La versión debe ser 8.x.
