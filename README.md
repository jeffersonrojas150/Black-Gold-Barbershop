# 🖤✨ Black Gold Barbershop

Sistema de reservas premium para barbería con autenticación basada en roles y gestión completa de citas.

![Black Gold Barbershop](frontend/public/logo2.png)

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Roles de Usuario](#-roles-de-usuario)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Base de Datos](#-base-de-datos)
- [API Endpoints](#-api-endpoints)
- [Equipo](#-equipo)

---

## 🎯 Descripción

**Black Gold Barbershop** es una plataforma web completa para la gestión de una barbería premium. Permite a los clientes reservar citas en línea, a los barberos gestionar su agenda, y a los administradores tener control total del negocio.

### Problema que resuelve:
- Eliminación de reservas telefónicas ineficientes
- Control centralizado de citas y barberos
- Prevención de conflictos de horarios
- Experiencia de usuario moderna y profesional

---

## ✨ Características

### 🌐 Páginas Públicas
- Landing page atractiva con información del negocio
- Catálogo de servicios con precios
- Presentación del equipo de barberos
- Sistema de registro e inicio de sesión

### 👤 Panel de Cliente
- Reserva de citas con selección de:
  - Servicio deseado
  - Barbero preferido
  - Fecha y hora disponible
- Visualización de horarios disponibles en tiempo real
- Historial completo de citas
- Cancelación de citas sin restricciones
- Dashboard con estadísticas personales

### 💈 Panel de Barbero
- Vista de citas asignadas
- Filtrado por fecha (hoy, todas, confirmadas, completadas)
- Marcar citas como completadas
- Dashboard con estadísticas de trabajo

### 🔐 Panel de Administrador
- **Gestión de Servicios:**
  - Crear, editar y eliminar servicios
  - Configurar precios y duraciones
  - Activar/desactivar servicios
  
- **Gestión de Barberos:**
  - Crear, editar y eliminar barberos
  - Configurar horarios de trabajo (por defecto o personalizado)
  - Gestionar especialidades y biografías
  - Activar/desactivar barberos
  
- **Gestión de Citas:**
  - Ver todas las citas del sistema
  - Confirmar, completar o cancelar citas
  - Eliminar citas
  - Filtrado por estado
  
- **Dashboard con Estadísticas:**
  - Total de citas
  - Citas por estado
  - Ingresos mensuales
  - Citas del mes actual

### 🔒 Seguridad
- Autenticación con JWT (JSON Web Tokens)
- Contraseñas encriptadas con bcrypt
- Middleware de protección de rutas
- Validación de permisos por rol

### 🎨 Diseño
- Tema elegante negro y dorado
- Diseño responsive (móvil, tablet, desktop)
- Menú hamburguesa en dispositivos móviles
- Animaciones suaves y transiciones
- Tipografía premium (Montserrat + Playfair Display)

---

## 🚀 Tecnologías

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Manejo de peticiones cross-origin

### Frontend
- **Next.js 15** - Framework de React
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP

### Infraestructura
- **Railway** - Hosting de base de datos MySQL
- **Vercel** (opcional) - Hosting del frontend

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MySQL** >= 8.0 (o acceso a Railway)
- **Git**

---

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/jeffersonrojas150/Black-Gold-Barbershop.git
cd black-gold-barbershop
```

### 2. Configurar Backend
```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend`:
```env
PORT=3001
DB_HOST=tu-host-railway.railway.app
DB_USER=root
DB_PASSWORD=tu-password
DB_NAME=railway
DB_PORT=3306
JWT_SECRET=tu-clave-secreta-muy-segura
```

### 3. Configurar Frontend
```bash
cd ../frontend
npm install
```

Crear archivo `.env.local` en la carpeta `frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🗄️ Configuración de Base de Datos

### Opción A: Usar el script de migración
```bash
cd backend
npm run migrate
npm run seed
```

### Opción B: Ejecutar SQL manualmente

1. Conectarse a MySQL
2. Ejecutar `backend/src/config/schema.sql`
3. Ejecutar `backend/src/config/seed.sql`

---

## ▶️ Uso

### Iniciar el Backend
```bash
cd backend
npm run dev
```

El servidor correrá en: `http://localhost:3001`

### Iniciar el Frontend
```bash
cd frontend
npm run dev
```

La aplicación correrá en: `http://localhost:3000`

---

## 👥 Roles de Usuario

### Usuarios de Prueba

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| **Admin** | admin@barbershop.com | password123 | Acceso completo al sistema |
| **Barbero** | alex@barbershop.com | password123 | Ver y completar sus citas |
| **Cliente** | juan@example.com | password123 | Reservar y gestionar citas |

### Permisos por Rol

#### 🔴 Administrador
- ✅ Gestionar servicios
- ✅ Gestionar barberos y sus horarios
- ✅ Ver y gestionar todas las citas
- ✅ Acceso a estadísticas completas
- ✅ Confirmar, completar o cancelar cualquier cita

#### 🔵 Barbero
- ✅ Ver sus citas asignadas
- ✅ Marcar citas como completadas
- ✅ Filtrar citas por fecha y estado
- ✅ Ver información de contacto de clientes

#### 🟢 Cliente
- ✅ Reservar citas
- ✅ Ver sus citas (pasadas y futuras)
- ✅ Cancelar citas
- ✅ Ver catálogo de servicios y barberos

---

## 📁 Estructura del Proyecto
```
black-gold-barbershop/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # Configuración MySQL
│   │   │   ├── schema.sql        # Esquema de BD
│   │   │   └── seed.sql          # Datos iniciales
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── serviceController.js
│   │   │   ├── barberController.js
│   │   │   └── appointmentController.js
│   │   ├── middleware/
│   │   │   └── auth.js           # Middleware JWT
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── services.js
│   │   │   ├── barbers.js
│   │   │   └── appointments.js
│   │   └── server.js             # Punto de entrada
│   ├── .env                      # Variables de entorno
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   ├── services/         # Servicios públicos
│   │   │   ├── barbers/          # Barberos públicos
│   │   │   ├── appointments/     # Panel cliente
│   │   │   ├── admin/            # Panel admin
│   │   │   └── barber/           # Panel barbero
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   │   └── Navbar.tsx
│   │   │   └── ui/
│   │   ├── lib/
│   │   │   └── AuthContext.tsx   # Contexto de autenticación
│   │   ├── services/
│   │   │   └── api.ts            # Servicios API
│   │   └── types/
│   │       └── index.ts          # TypeScript types
│   ├── public/
│   │   ├── logo.png              # Logo sin texto
│   │   └── logo2.png             # Logo completo
│   ├── .env.local
│   └── package.json
│
└── README.md
```

---

## 🗃️ Base de Datos

### Tablas Principales

#### `users`
- Almacena todos los usuarios del sistema
- Roles: 'admin', 'barber', 'client'
- Contraseñas hasheadas con bcrypt

#### `services`
- Servicios ofrecidos por la barbería
- Precio y duración configurables
- Se pueden activar/desactivar

#### `barbers`
- Información de cada barbero
- Vinculado a tabla `users`
- Especialidad y biografía

#### `barber_schedules`
- Horarios de trabajo de cada barbero
- Por día de la semana
- Horario de inicio y fin

#### `appointments`
- Registro de todas las citas
- Estados: 'pending', 'confirmed', 'completed', 'cancelled'
- Validación de conflictos de horario

---

## 🔌 API Endpoints

### Autenticación
```
POST   /api/auth/register          # Registrar nuevo usuario
POST   /api/auth/login             # Iniciar sesión
GET    /api/auth/me                # Obtener usuario actual
```

### Servicios
```
GET    /api/services               # Listar servicios
GET    /api/services/:id           # Obtener un servicio
POST   /api/services               # Crear servicio (admin)
PUT    /api/services/:id           # Actualizar servicio (admin)
DELETE /api/services/:id           # Eliminar servicio (admin)
```

### Barberos
```
GET    /api/barbers                # Listar barberos
GET    /api/barbers/:id            # Obtener un barbero
GET    /api/barbers/:id/schedule   # Obtener horarios de barbero
GET    /api/barbers/:id/availability?date=YYYY-MM-DD&service_id=1
POST   /api/barbers                # Crear barbero (admin)
PUT    /api/barbers/:id            # Actualizar barbero (admin)
DELETE /api/barbers/:id            # Eliminar barbero (admin)
```

### Citas
```
GET    /api/appointments           # Listar citas (filtradas por rol)
GET    /api/appointments/:id       # Obtener una cita
POST   /api/appointments           # Crear cita (client)
PUT    /api/appointments/:id/status # Actualizar estado
DELETE /api/appointments/:id       # Eliminar cita (admin)
GET    /api/appointments/stats     # Estadísticas
```


## 🎓 Proyecto Académico

Este proyecto fue desarrollado como parte del curso de **Desarrollo de Aplicaciones Web Avanzado** en **TECSUP - Lima, Perú**.

### Objetivos del Proyecto:
- ✅ Implementar un sistema completo con arquitectura cliente-servidor
- ✅ Aplicar autenticación y autorización basada en roles
- ✅ Diseñar e implementar una base de datos relacional
- ✅ Crear una API RESTful con Express.js
- ✅ Desarrollar una interfaz de usuario moderna con React/Next.js
- ✅ Implementar validaciones tanto en frontend como backend

---

## 👨‍💻 Equipo

Desarrollado con 🖤 por:

- **Jefferson Rojas**
  - Backend (Express.js, MySQL)
  - Sistema de autenticación
  - API RESTful
  - Gestión de barberos y horarios

- **Yudith Pacco**
  - UI/UX Design
  - Componentes React
  - Dashboards interactivos
  - Sistema de navegación

**Institución:** TECSUP - Lima, Perú  
**Fecha:** Diciembre 2025  
**Curso:** Desarrollo de Aplicaciones Web Avanzado

---

## 📝 Licencia

Este proyecto es de uso académico y educativo.

---

## 🙏 Agradecimientos

- A nuestros profesores de TECSUP por su guía
- A la comunidad de desarrolladores por los recursos compartidos

---

## 📞 Contacto

¿Preguntas o sugerencias?

- Email: jefferson.rojas@tecsup.edu.pe
- Email: yudith.pacco@tecsup.edu.pe
- GitHub: [@jeffersonrojas150](https://github.com/jeffersonrojas150)
- GitHub: [@yudi-star](https://github.com/yudi-star)

---

**⚡ Black Gold Barbershop - Tu estilo, nuestra pasión**