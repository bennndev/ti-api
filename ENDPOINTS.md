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
  "username": "string (optional, 3-30 caracteres)",
  "firstName": "string (optional, max 50)",
  "lastName": "string (optional, max 50)"
}
```

**Respuesta (200):**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "username": "string | null",
    "firstName": "string | null",
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
    "username": "string | null",
    "firstName": "string | null",
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

| Método | Path | Descripción |
|--------|------|-------------|
| POST | `/auth/sign-up` | Registro con email/password |
| POST | `/auth/sign-in` | Login con email/password |
| POST | `/auth/sign-out` | Logout |
| GET | `/auth/me` | Usuario actual |
| GET | `/auth/google` | Redirect OAuth Google |
| GET | `/auth/google/callback` | Callback OAuth Google |
| GET | `/auth/apple` | Redirect OAuth Apple |
| GET | `/auth/apple/callback` | Callback OAuth Apple |
