# Endpoints de Autenticación

Base URL: `http://localhost:3000`

---

## POST /auth/sign-up

**Descripción:** Registro de nuevo usuario con email y password

**Headers:**
- `Content-Type: application/json`

**Body (JSON):**
```json
{
  "email": "string (required, email válido)",
  "password": "string (required, min 8 caracteres)",
  "name": "string (required, es el nombre)",
  "lastName": "string (required, apellido)",
  "username": "string (optional, 3-30 caracteres)"
}
```

**Respuesta (200):**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "lastName": "string | null",
    "emailVerified": "boolean",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  },
  "session": {
    "token": "string",
    "expiresAt": "string (ISO date)"
  }
}
```

**Errores:**
- `400` — Body inválido (email mal formado, password < 8 chars)
- `409` — Email ya registrado

---

## POST /auth/sign-in

**Descripción:** Inicio de sesión con email y password

**Headers:**
- `Content-Type: application/json`

**Body (JSON):**
```json
{
  "email": "string (required, email válido)",
  "password": "string (required)"
}
```

**Respuesta (200):**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string (nullable)",
    "emailVerified": "boolean",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  },
  "session": {
    "token": "string",
    "expiresAt": "string (ISO date)"
  }
}
```

**Errores:**
- `400` — Body inválido
- `401` — Credenciales inválidas

---

## Credenciales de Testing

### Superadmin (rol: 1)
- **Email:** superadmin@ti-platform.com
- **Password:** Superadmin123!

### Roles disponibles
| ID | Code | Descripción |
|----|------|-------------|
| 1 | super_admin | Plenos poderes, crea usuarios y orgs |
| 2 | org_admin | Admin de organización |
| 3 | instructor | Crea experiencias educativas |
| 4 | student | Usuario final |

### Organizaciones de prueba
| ID | Name | Slug | Para |
|----|------|------|-------|
| 1 | System | system | Superadmin y usuarios del sistema |

---

## POST /auth/sign-out

**Descripción:** Cerrar sesión activa

**Headers:**
- `Cookie: better-auth.session_token=<token>`

**Body:** No requiere

**Respuesta (200):**
```json
{
  "message": "Session closed"
}
```

**Errores:**
- `401` — Sin sesión activa

---

## GET /auth/me

**Descripción:** Verificar sesión activa y obtener usuario actual

**Headers:**
- `Cookie: better-auth.session_token=<token>`

**Respuesta (200):**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "lastName": "string | null",
    "emailVerified": "boolean",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  },
  "session": {
    "token": "string",
    "expiresAt": "string (ISO date)"
  }
}
```

**Errores:**
- `401` — Sin sesión activa o token expirado

---

## POST /users

**Descripción:** Crear nuevo usuario (solo superadmin)

**Headers:**
- `Cookie: better-auth.session_token=<token>` (requerido, rol: super_admin)
- `Content-Type: application/json`

**Body (JSON):**
```json
{
  "email": "string (required, email válido)",
  "password": "string (required, min 8 caracteres)",
  "name": "string (required)",
  "lastName": "string (optional)",
  "username": "string (optional, 3-30 caracteres)",
  "orgId": "number (required, organization ID)",
  "roleId": "number (required, role ID: 1=super_admin, 2=org_admin, 3=instructor, 4=student)",
  "documentType": "string (optional, ej: DNI, PASAPORTE)",
  "documentNumber": "string (optional)",
  "preferredLanguage": "string (optional, ej: es, en)"
}
```

**Respuesta (201):**
```json
{
  "id": 1,
  "email": "string",
  "username": "string | null",
  "name": "string | null",
  "firstName": "string | null",
  "lastName": "string | null",
  "roleId": 2,
  "orgId": 1,
  "emailVerified": false,
  "status": true,
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

**Errores:**
- `400` — Body inválido
- `401` — Sin sesión activa
- `403` — No tiene permisos (no es superadmin)
- `409` — Email ya existe

---

## GET /users

**Descripción:** Listar usuarios (paginados)

**Headers:**
- `Cookie: better-auth.session_token=<token>` (requerido)

**Query params:**
- `page` — número de página (default: 1)
- `pageSize` — ítems por página (default: 20)
- `orgId` — filtrar por organización (default: todos)
- `status` — `true` para activos, `false` para inactivos (opcional)

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "email": "string",
      "username": "string | null",
      "name": "string | null",
      "firstName": "string | null",
      "lastName": "string | null",
      "roleId": 2,
      "orgId": 1,
      "emailVerified": false,
      "status": true,
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## GET /users/:id

**Descripción:** Obtener usuario por ID

**Headers:**
- `Cookie: better-auth.session_token=<token>` (requerido)

**Respuesta (200):**
```json
{
  "id": 1,
  "email": "string",
  "username": "string | null",
  "name": "string | null",
  "firstName": "string | null",
  "lastName": "string | null",
  "roleId": 2,
  "orgId": 1,
  "emailVerified": false,
  "status": true,
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

**Errores:**
- `401` — Sin sesión activa
- `404` — Usuario no encontrado

---

## PATCH /users/:id

**Descripción:** Actualizar usuario parcialmente

**Headers:**
- `Cookie: better-auth.session_token=<token>` (requerido)
- `Content-Type: application/json`

**Body (JSON):**
```json
{
  "name": "string (optional)",
  "lastName": "string (optional)",
  "username": "string (optional, 3-30 caracteres)",
  "documentType": "string (optional)",
  "documentNumber": "string (optional)",
  "preferredLanguage": "string (optional)",
  "status": "boolean (optional)"
}
```

**Respuesta (200):**
```json
{
  "id": 1,
  "email": "string",
  "username": "string | null",
  "name": "string | null",
  "firstName": "string | null",
  "lastName": "string | null",
  "roleId": 2,
  "orgId": 1,
  "emailVerified": false,
  "status": true,
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

**Errores:**
- `400` — Body inválido
- `401` — Sin sesión activa
- `403` — No puede actualizar usuarios de otras organizaciones
- `404` — Usuario no encontrado

---

## DELETE /users/:id

**Descripción:** Soft-delete de usuario

**Headers:**
- `Cookie: better-auth.session_token=<token>` (requerido)

**Respuesta (204):** No Content

**Errores:**
- `401` — Sin sesión activa
- `403` — No puede eliminar usuarios de otras organizaciones, o eliminar su propia cuenta
- `404` — Usuario no encontrado

---

## GET /organizations

**Descripción:** Listar organizaciones (paginadas)

**Headers:**
- `Cookie: better-auth.session_token=<token>` (requerido)

**Query params:**
- `page` — número de página (default: 1)
- `pageSize` — ítems por página (default: 20)
- `status` — `true` para activas, `false` para inactivas (opcional)

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "string",
      "slug": "string",
      "ruc": "string",
      "logo": "string",
      "country": "string",
      "status": true,
      "lastActivityAt": "string (ISO date) | null",
      "totalUsers": 0,
      "totalGroups": 0,
      "storageUsedMb": 0.0,
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## POST /organizations

**Descripción:** Crear nueva organización

**Headers:**
- `Cookie: better-auth.session_token=<token>` (requerido)
- `Content-Type: application/json`

**Body (JSON):**
```json
{
  "name": "string (required, 1-25 chars)",
  "ruc": "string (required, 1-20 chars)",
  "country": "string (required, 1-48 chars)",
  "logo": "string (optional, max 255 chars)"
}
```

**Respuesta (201):**
```json
{
  "id": 1,
  "name": "string",
  "slug": "string (generado desde name)",
  "ruc": "string",
  "logo": "string",
  "country": "string",
  "status": true,
  "lastActivityAt": null,
  "totalUsers": 0,
  "totalGroups": 0,
  "storageUsedMb": null,
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

**Errores:**
- `400` — Body inválido
- `401` — Sin sesión activa
- `409` — `name` o `ruc` ya existen

---

## GET /organizations/:id

**Descripción:** Obtener organización por ID

**Headers:**
- `Cookie: better-auth.session_token=<token>` (requerido)

**Respuesta (200):**
```json
{
  "id": 1,
  "name": "string",
  "slug": "string",
  "ruc": "string",
  "logo": "string",
  "country": "string",
  "status": true,
  "lastActivityAt": "string (ISO date) | null",
  "totalUsers": 0,
  "totalGroups": 0,
  "storageUsedMb": 0.0,
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

**Errores:**
- `401` — Sin sesión activa
- `404` — Organización no encontrada

---

## PATCH /organizations/:id

**Descripción:** Actualizar organización parcialmente

**Headers:**
- `Cookie: better-auth.session_token=<token>` (requerido)
- `Content-Type: application/json`

**Body (JSON):**
```json
{
  "name": "string (optional, 1-25 chars)",
  "ruc": "string (optional, 1-20 chars)",
  "logo": "string (optional)",
  "country": "string (optional)",
  "status": "boolean (optional)"
}
```

**Respuesta (200):**
```json
{
  "id": 1,
  "name": "string",
  "slug": "string",
  "ruc": "string",
  "logo": "string",
  "country": "string",
  "status": true,
  "lastActivityAt": "string (ISO date) | null",
  "totalUsers": 0,
  "totalGroups": 0,
  "storageUsedMb": 0.0,
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

**Errores:**
- `400` — Body inválido
- `401` — Sin sesión activa
- `404` — Organización no encontrada
- `409` — `name` o `ruc` ya existen en otra organización

---

## DELETE /organizations/:id

**Descripción:** Soft-delete de organización (no elimina, marca `deletedAt`)

**Headers:**
- `Cookie: better-auth.session_token=<token>` (requerido)

**Respuesta (204):** No Content

**Errores:**
- `401` — Sin sesión activa
- `404` — Organización no encontrada

---

## Configuración

### OAuth automático

Better Auth maneja automáticamente los siguientes endpoints OAuth:

| Provider | Redirect | Callback |
|----------|----------|----------|
| Google | `GET /auth/google` | `GET /auth/google/callback` |
| Apple | `GET /auth/apple` | `GET /auth/apple/callback` |

El flujo OAuth:
1. Frontend redirige a `GET /auth/google` (o apple)
2. Better Auth redirige al provider OAuth
3. Provider callback a `GET /auth/google/callback`
4. Better Auth crea usuario y sesión, setea cookie

### Cookies

Better Auth maneja cookies automáticamente:
- `better-auth.session_token` — cookie con el token de sesión
- Flags: `httpOnly`, `secure` en producción, `sameSite: lax`
- No requiere manejo manual en el frontend

### Variables de entorno necesarias

```env
# OAuth Google
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# OAuth Apple
APPLE_CLIENT_ID=tu_apple_client_id
APPLE_TEAM_ID=tu_apple_team_id
APPLE_KEY_ID=tu_apple_key_id
APPLE_PRIVATE_KEY=tu_apple_private_key

# API Base (para OAuth callback)
BETTER_AUTH_URL=http://localhost:3000
```

### Endpoint list

| Método | Path | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/auth/sign-in` | Login con email/password | Public |
| POST | `/auth/sign-out` | Logout | Cookie |
| GET | `/auth/me` | Usuario actual | Cookie |
| GET | `/auth/google` | Redirect OAuth Google | Public |
| GET | `/auth/google/callback` | Callback OAuth Google | Public |
| GET | `/auth/apple` | Redirect OAuth Apple | Public |
| GET | `/auth/apple/callback` | Callback OAuth Apple | Public |
| POST | `/users` | Crear usuario | Cookie (super_admin) |
| GET | `/users` | Listar usuarios | Cookie |
| GET | `/users/:id` | Obtener usuario por ID | Cookie |
| PATCH | `/users/:id` | Actualizar usuario | Cookie |
| DELETE | `/users/:id` | Soft-delete usuario | Cookie |
| GET | `/organizations` | Listar organizaciones | Cookie |
| POST | `/organizations` | Crear organización | Cookie |
| GET | `/organizations/:id` | Obtener organización por ID | Cookie |
| PATCH | `/organizations/:id` | Actualizar organización | Cookie |
| DELETE | `/organizations/:id` | Soft-delete organización | Cookie |
