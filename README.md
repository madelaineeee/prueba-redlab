# Gestión de Productos

Sistema web completo para gestionar productos con autenticación, autorización, CRUD y reportes en PDF. Desarrollado con .NET 8 y Next.js 15.

## 🎯 Características

- ✅ Autenticación y autorización con JWT
- ✅ CRUD completo de productos
- ✅ Tabla con filtros, búsqueda y paginación
- ✅ Generación de reportes en PDF con QuestPDF
- ✅ Selector dinámico de columnas (tabla y PDF)
- ✅ Auditoría: usuario y fecha de creación/modificación
- ✅ 25 productos iniciales cargados automáticamente
- ✅ Diseño responsivo con Tailwind CSS

## 🛠️ Tecnologías

| Componente | Tecnologías |
|-----------|------------|
| **Backend** | .NET 8, Entity Framework Core, SQL Server, JWT, QuestPDF |
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS, Axios, Lucide Icons |
| **DevOps** | Docker Compose, Git |

## 📋 Requisitos Previos

- .NET 8 SDK
- Node.js 20+
- Docker & Docker Compose
- Git

> ⚠️ **Si no tienes nada instalado:** Ver [GUIA_INSTALACION.md](./GUIA_INSTALACION.md) para instrucciones paso a paso.
---

# 🚀 Instalación y Ejecución

## 1. Clonar el repositorio

```bash
git clone https://github.com/madelaineeee/prueba-redlab.git
cd prueba-reblab
```

## 2. Levantar la base de datos

```bash
docker compose up -d
```

Esto inicia SQL Server en `localhost:1433`

---

## 3. Ejecutar el Backend

En una terminal:

```bash
cd backend/GestionProductos.API
dotnet run
```

El backend estará disponible en:

```text
http://localhost:5219
```

Swagger disponible en:

```text
http://localhost:5219/swagger
```

---

## 4. Ejecutar el Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

> `npm install` solo es necesario la primera vez.

El frontend estará disponible en:

```text
http://localhost:3000
```

---

## 5. Acceder a la aplicación

Ve a:

```text
http://localhost:3000
```

Serás redirigido automáticamente al inicio de sesión.

### Credenciales de demostración

```text
Email: admin@demo.com
Contraseña: Admin123!
```

---

# 📊 Funcionalidades Principales

## Gestión de Productos

### Crear

Botón **Nuevo Producto** con formulario de registro.

### Leer

Tabla paginada con búsqueda y filtros.

### Actualizar

Opción **Editar** para modificar registros existentes.

### Eliminar

Opción **Eliminar** con confirmación previa.

## Reportes PDF

- Generación dinámica de reportes.
- Respeta filtros aplicados.
- Selección de columnas a exportar.

---

## Filtros

### Búsqueda

Por:

- Nombre
- Descripción

### Estado

- Activos
- Inactivos
- Todos

### Ordenamiento

- Más recientes
- Más antiguos
- Nombre A-Z

---

# 🗄️ Migraciones

Las migraciones se aplican automáticamente al iniciar el backend.

Para crear una nueva migración:

```bash
cd backend/GestionProductos.API
dotnet ef migrations add NombreMigracion
dotnet ef database update
```

---

# 🐛 Troubleshooting

| Problema | Solución |
|-----------|-----------|
| Puerto 5219 ocupado | Cambiar puerto en `launchSettings.json` |
| SQL Server no conecta | Verificar Docker con `docker ps` |
| Token expirado | Cerrar sesión e iniciar nuevamente |
| Error CORS | Confirmar que backend y frontend estén ejecutándose |

---

# 📦 Datos Iniciales

El sistema carga automáticamente:

- 1 usuario administrador
- 30 productos de ejemplo de canasta básica

### Usuario administrador

```text
Email: admin@demo.com
Contraseña: Admin123!
```

Los datos se cargan únicamente la primera vez.

Para reiniciar completamente:

```bash
docker compose down -v
docker compose up -d
dotnet run
```

