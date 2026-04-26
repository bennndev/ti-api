# ti-api

API REST para plataforma de aprendizaje XR/VR con gestión organizacional multi-tenant.

**Stack:** NestJS v11 + Prisma 7 + Neon PostgreSQL + Better Auth + Zod

---

## Quick Start

```bash
# Clonar
git clone https://github.com/bennndev/ti-api.git
cd ti-api

# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env
# Editar .env con tus credenciales

# Generar Prisma Client y crear tablas
npx prisma generate
npx prisma migrate dev

# Levantar en desarrollo
npm run start:dev
```

La API queda disponible en `http://localhost:3000`. Swagger UI en `http://localhost:3000/api`.

---

## Requisitos

- **Node.js** v20+
- **PostgreSQL** (Neon PostgreSQL recomendado para desarrollo)

---

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection pooled (`*-pooler.region.neon.tech`) |
| `DIRECT_URL` | Connection directa para Prisma CLI (`*.region.neon.tech`) |
| `BETTER_AUTH_URL` | Base URL de la API (ej: `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | OAuth Google (opcional) |
| `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` | OAuth Apple (opcional) |

---

## Modelo de Datos

```
Organization (tenant root)
├── Department
│   └── Specialty
│       └── Course
│           └── Experience (VR, VIDEO, DOCUMENT, SLIDES, INDUCTION)
│               └── Addressable (contenido XR)
├── Group (curso asignado a estudiantes)
│   ├── User_Group (membresía N:M con rol LEADER/MEMBER)
│   └── Group_Experience (tracking de progreso)
└── User (con Role: SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT)
```

---

## Roles y Permisos

### Roles disponibles

| Rol | Descripción |
|-----|-------------|
| `SUPER_ADMIN` | Plenos poderes sobre todas las organizaciones |
| `ORG_ADMIN` | Administra su organización |
| `INSTRUCTOR` | Crea y gestiona experiencias educativas |
| `STUDENT` | Usuario final, consume experiencias |

### Matriz de Permisos

| Permiso | SUPER_ADMIN | ORG_ADMIN | INSTRUCTOR | STUDENT |
|---------|:-----------:|:---------:|:----------:|:-------:|
| organization:create | ✅ | ❌ | ❌ | ❌ |
| organization:read | ✅ | ❌ | ❌ | ❌ |
| organization:update | ✅ | ❌ | ❌ | ❌ |
| organization:delete | ✅ | ❌ | ❌ | ❌ |
| user:create | ✅ | ✅ | ❌ | ❌ |
| user:read | ✅ | ✅ | ✅ | ✅ |
| user:update | ✅ | ✅ | ❌ | ❌ |
| user:delete | ✅ | ✅ | ❌ | ❌ |
| role:read | ✅ | ✅ | ❌ | ❌ |
| department:create | ✅ | ✅ | ❌ | ❌ |
| department:read | ✅ | ✅ | ❌ | ❌ |
| department:update | ✅ | ✅ | ❌ | ❌ |
| department:delete | ✅ | ✅ | ❌ | ❌ |
| specialty:create | ✅ | ✅ | ❌ | ❌ |
| specialty:read | ✅ | ✅ | ❌ | ❌ |
| specialty:update | ✅ | ✅ | ❌ | ❌ |
| specialty:delete | ✅ | ✅ | ❌ | ❌ |
| course:create | ✅ | ✅ | ❌ | ❌ |
| course:read | ✅ | ✅ | ❌ | ❌ |
| course:update | ✅ | ✅ | ❌ | ❌ |
| course:delete | ✅ | ✅ | ❌ | ❌ |
| experience:create | ✅ | ✅ | ❌ | ❌ |
| experience:read | ✅ | ✅ | ❌ | ❌ |
| experience:update | ✅ | ✅ | ✅ | ❌ |
| experience:delete | ✅ | ✅ | ❌ | ❌ |
| experience:session | ✅ | ✅ | ✅ | ✅ |
| experience:addressable | ✅ | ✅ | ❌ | ❌ |
| group:create | ✅ | ✅ | ✅ | ❌ |
| group:read | ✅ | ✅ | ✅ | ❌ |
| group:update | ✅ | ✅ | ✅ | ❌ |
| group:delete | ✅ | ✅ | ✅ | ❌ |
| user-group:create | ✅ | ✅ | ✅ | ❌ |
| user-group:read | ✅ | ✅ | ✅ | ❌ |
| user-group:update | ✅ | ✅ | ✅ | ❌ |
| user-group:delete | ✅ | ✅ | ✅ | ❌ |
| group-experience:create | ✅ | ✅ | ✅ | ❌ |
| group-experience:read | ✅ | ✅ | ✅ | ❌ |
| group-experience:update | ✅ | ✅ | ✅ | ❌ |
| group-experience:delete | ✅ | ✅ | ✅ | ❌ |
| score-event:create | ❌ | ❌ | ❌ | ✅ |
| score-event:read | ✅ | ✅ | ✅ | ✅ |
| score-event:delete | ✅ | ✅ | ❌ | ❌ |
| session:read | ✅ | ✅ | ✅ | ✅ |
| session:update | ❌ | ❌ | ✅ | ✅ |
| addressable:create | ✅ | ✅ | ❌ | ❌ |
| addressable:read | ✅ | ✅ | ✅ | ✅ |
| addressable:update | ✅ | ✅ | ✅ | ❌ |
| addressable:delete | ✅ | ✅ | ❌ | ❌ |
| telemetry:create | ❌ | ❌ | ❌ | ✅ |
| activity-log:read | ✅ | ✅ | ❌ | ❌ |

---

## Endpoints

### Convenciones

- Formato de permiso: `recurso:accion`
- Acciones: `create`, `read`, `update`, `delete`
- Acciones especiales: `session`, `addressable`, `telemetry`
- `PUBLIC` = endpoint sin autenticación

### Auth

| Method | Path | Permission |
|--------|------|------------|
| POST | /auth/sign-up | PUBLIC |
| POST | /auth/sign-in | PUBLIC |
| POST | /auth/sign-out | PUBLIC* |
| GET | /auth/me | PUBLIC* |

*sign-out y me requieren autenticación (AuthGuard valida sesión, no rol)

### Organizations

| Method | Path | Permission |
|--------|------|------------|
| POST | /organizations | organization:create |
| GET | /organizations | organization:read |
| GET | /organizations/:id | organization:read |
| PATCH | /organizations/:id | organization:update |
| DELETE | /organizations/:id | organization:delete |

### Users

| Method | Path | Permission |
|--------|------|------------|
| POST | /users | user:create |
| GET | /users | user:read |
| GET | /users/:id | user:read |
| PATCH | /users/:id | user:update |
| DELETE | /users/:id | user:delete |

### Roles

| Method | Path | Permission |
|--------|------|------------|
| GET | /roles | role:read |
| GET | /roles/:id | role:read |

### Departments

| Method | Path | Permission |
|--------|------|------------|
| POST | /departments | department:create |
| GET | /departments | department:read |
| GET | /departments/:id | department:read |
| PATCH | /departments/:id | department:update |
| DELETE | /departments/:id | department:delete |

### Specialties

| Method | Path | Permission |
|--------|------|------------|
| POST | /specialties | specialty:create |
| GET | /specialties | specialty:read |
| GET | /specialties/:id | specialty:read |
| PATCH | /specialties/:id | specialty:update |
| DELETE | /specialties/:id | specialty:delete |

### Courses

| Method | Path | Permission |
|--------|------|------------|
| POST | /courses | course:create |
| GET | /courses | course:read |
| GET | /courses/:id | course:read |
| PATCH | /courses/:id | course:update |
| DELETE | /courses/:id | course:delete |

### Experiences

| Method | Path | Permission |
|--------|------|------------|
| POST | /experiences | experience:create |
| GET | /experiences | experience:read |
| GET | /experiences/:id | experience:read |
| PATCH | /experiences/:id | experience:update |
| DELETE | /experiences/:id | experience:delete |
| POST | /experiences/:experienceId/sessions | experience:session |
| GET | /experiences/:experienceId/addressable | experience:addressable |

### Groups

| Method | Path | Permission |
|--------|------|------------|
| POST | /groups | group:create |
| GET | /groups | group:read |
| GET | /groups/:id | group:read |
| PATCH | /groups/:id | group:update |
| DELETE | /groups/:id | group:delete |

### User-Groups

| Method | Path | Permission |
|--------|------|------------|
| POST | /user-groups | user-group:create |
| GET | /user-groups | user-group:read |
| GET | /user-groups/:userId/:groupId | user-group:read |
| PATCH | /user-groups/:userId/:groupId | user-group:update |
| DELETE | /user-groups/:userId/:groupId | user-group:delete |

### Group-Experiences

| Method | Path | Permission |
|--------|------|------------|
| POST | /group-experiences | group-experience:create |
| GET | /group-experiences | group-experience:read |
| GET | /group-experiences/:groupId/:experienceId | group-experience:read |
| PATCH | /group-experiences/:groupId/:experienceId | group-experience:update |
| DELETE | /group-experiences/:groupId/:experienceId | group-experience:delete |

### Score-Events

| Method | Path | Permission |
|--------|------|------------|
| POST | /score-events | score-event:create |
| GET | /score-events | score-event:read |
| GET | /score-events/session/:sessionId | score-event:read |
| GET | /score-events/group/:groupId/experience/:experienceId | score-event:read |
| GET | /score-events/:id | score-event:read |
| DELETE | /score-events/:id | score-event:delete |

### Sessions

| Method | Path | Permission |
|--------|------|------------|
| PATCH | /sessions/:sessionId/complete | session:update |
| GET | /sessions/:sessionId | session:read |

### Addressables

| Method | Path | Permission |
|--------|------|------------|
| POST | /addressables | addressable:create |
| GET | /addressables | addressable:read |
| GET | /addressables/:id | addressable:read |
| PATCH | /addressables/:id | addressable:update |
| DELETE | /addressables/:id | addressable:delete |

### Telemetry

| Method | Path | Permission |
|--------|------|------------|
| POST | /telemetry/session | telemetry:create |

### XR-Auth

| Method | Path | Permission |
|--------|------|------------|
| POST | /xr-auth/generate-pin | PUBLIC* |
| POST | /xr-auth/validate-pin | PUBLIC* |

*generate-pin requiere usuario autenticado. validate-pin es público (PIN + device).

### Activity-Log

| Method | Path | Permission |
|--------|------|------------|
| GET | /activity-log | activity-log:read |
| GET | /activity-log/:id | activity-log:read |

---

## Comandos

```bash
# Desarrollo
npm run start:dev        # watch mode
npm run start            # normal

# Producción
npm run build
npm run start:prod

# Prisma
npx prisma migrate dev   # crear migración
npx prisma generate      # generar client
npm run db:push          # push schema sin migration

# Calidad
npm run lint
npm run format

# Tests
npm run test
npm run test:e2e
```

---

## Arquitectura

```
src/
├── main.ts                     # Bootstrap, Swagger, CORS, Better Auth
├── app.module.ts               # Root module
├── lib/
│   ├── prisma.ts              # Prisma singleton con Neon adapter
│   └── auth.ts                # Better Auth configuration
└── modules/
    ├── auth/                  # Auth (Better Auth)
    ├── organization/          # Organization → Department → Specialty
    ├── learning/              # Course → Experience → Group
    ├── rbac/                  # Role, Permission, Role_Permission
    ├── contact/               # Phone, Email
    ├── xr-session/            # XR Sessions y Device Pins
    ├── score-event/           # Score tracking
    ├── telemetry/             # XR Telemetry events
    └── activity-log/          # Audit log
```

**Patrón por recurso:** Controller → Service → Repository → Prisma

---

## Autenticación

Better Auth maneja:

- `POST /auth/sign-up` — registro email/password
- `POST /auth/sign-in` — login email/password
- `POST /auth/sign-out` — logout
- `GET /auth/google` — redirect OAuth Google
- `GET /auth/google/callback` — callback Google
- `GET /auth/apple` — redirect OAuth Apple
- `GET /auth/apple/callback` — callback Apple

---

## CORS

CORS habilitado para `http://localhost:3001` (frontend). Se puede modificar en `src/main.ts`.
