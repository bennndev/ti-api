# API Endpoints para Unity (Meta Quest 3)

> Endpoints que la app Unity consume. Basado en la base de datos final de Tecsup Inmersivo.

---

## 1. Autenticación

### POST `/auth/pin-login`

Login del headset VR mediante PIN temporal de 6 dígitos.

**Request:**
```json
{
  "pin": "482916"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 42,
    "first_name": "Carlos",
    "last_name": "Mendoza",
    "username": "cmendoza",
    "role": {
      "id": 4,
      "code": "student",
      "name": "Estudiante"
    },
    "organization": {
      "id": 1,
      "name": "Tecsup",
      "slug": "tecsup",
      "logo": "https://minio.local/logos/tecsup.png"
    },
    "preferred_language": "es"
  }
}
```

**Response 401:**
```json
{
  "statusCode": 401,
  "message": "PIN inválido o expirado",
  "error": "Unauthorized"
}
```

---

### POST `/auth/refresh`

Renovar el access token usando el refresh token.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 2. Grupos del Usuario

### GET `/users/:userId/groups`

Obtener los grupos (con curso y especialidad) a los que pertenece el usuario.

**Headers:** `Authorization: Bearer {access_token}`

**Response 200:**
```json
{
  "data": [
    {
      "group": {
        "id": 7,
        "name": "Grupo A - Perforación 2025",
        "code": "GRP-PERF-A25",
        "status": true,
        "start_date": "2025-03-01",
        "end_date": "2025-06-30"
      },
      "role_in_group": "member",
      "status": "active",
      "joined_at": "2025-03-01T08:00:00Z",
      "course": {
        "id": 3,
        "name": "Análisis de Fallas en Herramientas de Perforación",
        "description": "Identificación y prevención de fallas en brocas, barras y shanks",
        "image": "https://minio.local/courses/perf-fallas.jpg",
        "status": true
      },
      "specialty": {
        "id": 2,
        "name": "Perforación",
        "code": "PERF",
        "image": "https://minio.local/specialties/perf.png"
      },
      "department": {
        "id": 1,
        "name": "Minería"
      },
      "experience_count": 3,
      "completed_count": 1
    }
  ]
}
```

---

## 3. Experiencias del Grupo

### GET `/groups/:groupId/experiences`

Obtener las experiencias asignadas a un grupo, con el progreso del usuario.

**Headers:** `Authorization: Bearer {access_token}`

**Query params:** `?user_id=42` (para obtener el progreso individual)

**Response 200:**
```json
{
  "data": [
    {
      "experience": {
        "id": 10,
        "name": "Fallas en Brocas de Perforación",
        "description": "Identificación de rajadura en borde, rotura anular y botones agrietados",
        "type": "VR",
        "image": "https://minio.local/experiences/fallas-brocas.jpg",
        "duration": 900,
        "score": 70.0,
        "status": "available",
        "attemps": 3,
        "order": 1,
        "avg_score": 78.5,
        "difficulty_rating": 0.32
      },
      "group_experience": {
        "group_id": 7,
        "experience_id": 10,
        "mandatory": true,
        "status": "completed",
        "final_score": 85.0,
        "attemps": 1,
        "started_at": "2025-04-10T14:30:00Z",
        "completed_at": "2025-04-10T14:45:00Z",
        "time_spent": 872
      },
      "addressable": {
        "bundle_url": "https://minio.local/addressables/exp-10/v1.2/",
        "version": "1.2",
        "size_mb": 245,
        "catalog_url": "https://minio.local/addressables/exp-10/v1.2/catalog.json"
      }
    },
    {
      "experience": {
        "id": 11,
        "name": "Fallas en Barras de Perforación",
        "description": "Fatiga superficial y picadura en roscas",
        "type": "VR",
        "image": "https://minio.local/experiences/fallas-barras.jpg",
        "duration": 720,
        "score": 70.0,
        "status": "available",
        "attemps": 3,
        "order": 2,
        "avg_score": null,
        "difficulty_rating": null
      },
      "group_experience": {
        "group_id": 7,
        "experience_id": 11,
        "mandatory": true,
        "status": "pending",
        "final_score": null,
        "attemps": 0,
        "started_at": null,
        "completed_at": null,
        "time_spent": null
      },
      "addressable": {
        "bundle_url": "https://minio.local/addressables/exp-11/v1.0/",
        "version": "1.0",
        "size_mb": 198,
        "catalog_url": "https://minio.local/addressables/exp-11/v1.0/catalog.json"
      }
    }
  ]
}
```

---

## 4. Iniciar Sesión de Experiencia

### POST `/experiences/:experienceId/sessions`

Registrar el inicio de una sesión de experiencia. Retorna un `session_id` único para rastrear telemetría.

**Headers:** `Authorization: Bearer {access_token}`

**Request:**
```json
{
  "group_id": 7,
  "device_type": "vr_headset",
  "platform": "Meta Quest 3 v62",
  "ip_address": "192.168.1.105"
}
```

**Response 201:**
```json
{
  "session_id": "sess_a1b2c3d4e5f6",
  "started_at": "2025-04-18T10:30:00Z",
  "experience_id": 10,
  "attempt_number": 2
}
```

---

## 5. Enviar Score Events (Telemetría en Tiempo Real)

### POST `/sessions/:sessionId/events`

Enviar un evento de puntaje durante la evaluación. Se envía uno por cada respuesta del usuario.

**Headers:** `Authorization: Bearer {access_token}`

**Request (batch — array de eventos):**
```json
{
  "events": [
    {
      "event_id": "caso-1-tipo-falla",
      "event_type": "score",
      "timestamp": "2025-04-18T10:35:12Z",
      "data": {
        "case_number": 1,
        "question_type": "failure_type",
        "question_text": "¿Qué falla ves en esta broca?",
        "options": [
          "Rajadura en el borde",
          "Rotura anular",
          "Botones agrietados",
          "Desgaste normal"
        ],
        "correct_answer": "Rajadura en el borde",
        "user_answer": "Rajadura en el borde",
        "is_correct": true,
        "attempts_used": 1,
        "response_time_seconds": 8.3,
        "score_delta": 10
      }
    },
    {
      "event_id": "caso-1-causa",
      "event_type": "score",
      "timestamp": "2025-04-18T10:35:45Z",
      "data": {
        "case_number": 1,
        "question_type": "cause",
        "question_text": "¿Cuál es la causa principal de esta falla?",
        "options": [
          "Exceso de barrido",
          "Embolado incorrecto con rosca gastada",
          "Sobreperforación sin afilado",
          "Ambiente ácido"
        ],
        "correct_answer": "Embolado incorrecto con rosca gastada",
        "user_answer": "Exceso de barrido",
        "is_correct": false,
        "attempts_used": 1,
        "response_time_seconds": 12.1,
        "score_delta": 0
      }
    }
  ]
}
```

**Response 202:**
```json
{
  "received": 2,
  "session_id": "sess_a1b2c3d4e5f6"
}
```

---

## 6. Finalizar Sesión / Enviar Resultados

### PATCH `/sessions/:sessionId/complete`

Enviar resultados finales al terminar la evaluación. Actualiza `Group_Experience`.

**Headers:** `Authorization: Bearer {access_token}`

**Request:**
```json
{
  "final_score": 85.0,
  "total_time_seconds": 872,
  "total_correct": 7,
  "total_incorrect": 2,
  "total_questions": 9,
  "cases": [
    {
      "case_number": 1,
      "failure_name": "Rajadura en el borde",
      "type_correct": true,
      "cause_correct": false,
      "recommendation_correct": true,
      "case_time_seconds": 285
    },
    {
      "case_number": 2,
      "failure_name": "Rotura anular en el cuerpo",
      "type_correct": true,
      "cause_correct": true,
      "recommendation_correct": true,
      "case_time_seconds": 310
    },
    {
      "case_number": 3,
      "failure_name": "Botones agrietados",
      "type_correct": true,
      "cause_correct": true,
      "recommendation_correct": false,
      "case_time_seconds": 277
    }
  ],
  "interactions_count": 47,
  "pause_count": 1,
  "error_count": 0,
  "rating": 4
}
```

**Response 200:**
```json
{
  "session_id": "sess_a1b2c3d4e5f6",
  "completed_at": "2025-04-18T10:44:32Z",
  "group_experience_updated": {
    "status": "completed",
    "final_score": 85.0,
    "attemps": 2,
    "time_spent": 872
  },
  "experience_stats_updated": {
    "avg_score": 79.2,
    "total_completions": 15,
    "total_attempts": 22,
    "difficulty_rating": 0.32
  }
}
```

---

## 7. Activity Log (Fire-and-forget)

### POST `/activity-log`

Registrar acciones del usuario. Se puede enviar en batch. No bloquea la UI.

**Headers:** `Authorization: Bearer {access_token}`

**Request:**
```json
{
  "events": [
    {
      "action": "login",
      "entity": null,
      "entity_id": null,
      "metadata": { "method": "pin", "device": "Quest 3" },
      "ip_address": "192.168.1.105"
    },
    {
      "action": "start_experience",
      "entity": "Experience",
      "entity_id": 10,
      "metadata": { "group_id": 7, "attempt": 2 },
      "ip_address": "192.168.1.105"
    },
    {
      "action": "complete_experience",
      "entity": "Experience",
      "entity_id": 10,
      "metadata": { "score": 85.0, "time": 872, "rating": 4 },
      "ip_address": "192.168.1.105"
    }
  ]
}
```

**Response 202:**
```json
{
  "received": 3
}
```

---

## 8. Verificar Versión de Addressable

### GET `/experiences/:experienceId/addressable`

Verificar si hay una nueva versión del bundle disponible (para cache invalidation).

**Headers:** `Authorization: Bearer {access_token}`

**Response 200:**
```json
{
  "experience_id": 10,
  "current_version": "1.2",
  "bundle_url": "https://minio.local/addressables/exp-10/v1.2/",
  "catalog_url": "https://minio.local/addressables/exp-10/v1.2/catalog.json",
  "size_mb": 245,
  "updated_at": "2025-04-15T09:00:00Z"
}
```

---

## Notas de Implementación para Unity

### Headers comunes

Todos los endpoints autenticados requieren:
```
Authorization: Bearer {access_token}
Content-Type: application/json
X-Device-Type: vr_headset
X-Platform: quest3
X-App-Version: 1.0.0
```

### Manejo de errores

```json
{
  "statusCode": 401,
  "message": "Token expirado",
  "error": "Unauthorized"
}
```

Cuando se recibe 401, el `ApiClient` de Unity debe intentar refresh automático con `/auth/refresh`. Si falla, redirigir a pantalla de login.

### Retry y offline

- Los score events (endpoint 5) se guardan localmente si no hay conexión y se reenvían al recuperar red.
- El session complete (endpoint 6) es crítico y debe reintentarse hasta 3 veces con backoff exponencial.
- Los activity logs (endpoint 7) son fire-and-forget; si fallan, se descartan.

### Flujo completo en Unity

```
1. PIN Login          → POST /auth/pin-login
2. Cargar grupos      → GET /users/:id/groups
3. Cargar experiencias → GET /groups/:id/experiences?user_id=X
4. Verificar cache     → GET /experiences/:id/addressable
5. Descargar bundle   → Addressables.LoadFromCatalog(catalog_url)
6. Iniciar sesión     → POST /experiences/:id/sessions
7. [Durante evaluación] → POST /sessions/:id/events (batch cada 30s o al terminar caso)
8. Finalizar          → PATCH /sessions/:id/complete
9. Activity log       → POST /activity-log (batch al cerrar)
```
