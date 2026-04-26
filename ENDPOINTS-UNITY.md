# Guía de Endpoints API para Unity (Meta Quest 3)

> Endpoints funcionales de la API TI para consumo desde Unity XR.
> Todos los endpoints requieren autenticación excepto el login con PIN.

---

## Headers Comunes

Para todos los endpoints autenticados:

```
Authorization: Bearer {access_token}
Content-Type: application/json
X-Device-Type: vr_headset
X-Platform: Meta Quest 3
X-App-Version: 1.0.0
```

---

## Flujo de Autenticación

```
1. [APP] POST /xr-auth/validate-pin  → Recibe { token, user }
2. [APP] Usa token en Authorization de todos los requests siguientes
```

---

## 1. Login XR con PIN

**POST** `/xr-auth/validate-pin`

**Descripción:** El usuario introducirá el PIN de 6 dígitos en el headset VR para iniciar sesión. El PIN fue generado desde la web/app.

**Headers:** `Content-Type: application/json` (sin Authorization)

**Request:**
```json
{
  "pin": "482916"
}
```

**Respuesta 200 (éxito):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2026-04-27T00:00:00.000Z",
  "user": {
    "id": "cmog1aln70000lc8sjix8p4fl",
    "email": "carlos@tecsup.edu.pe",
    "name": "Carlos Mendoza",
    "orgId": 1,
    "roleId": 4
  }
}
```

**Respuesta 401 (error - PIN inválido o expirado):**
```json
{
  "statusCode": 401,
  "message": "Invalid or expired PIN",
  "error": "Unauthorized"
}
```

---

## 2. Obtener Datos del Usuario

**GET** `/users/:id`

**Descripción:** El usuario consultará sus propios datos después del login para obtener su ID de organización y verificar sesión.

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta 200 (éxito):**
```json
{
  "id": "cmog1aln70000lc8sjix8p4fl",
  "email": "carlos@tecsup.edu.pe",
  "username": "cmendoza",
  "name": "Carlos",
  "firstName": "Carlos",
  "lastName": "Mendoza",
  "roleId": 4,
  "orgId": 1,
  "emailVerified": false,
  "status": true,
  "createdAt": "2026-04-01T00:00:00.000Z",
  "updatedAt": "2026-04-26T00:00:00.000Z"
}
```

**Respuesta 401 (error - token inválido):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**Dependencias:** Requiere token del paso 1.

---

## 3. Obtener Experiencias del Grupo

**GET** `/group-experiences?groupId={id}`

**Descripción:** El usuario consultará las experiencias asignadas a su grupo para ver cuáles están disponibles, completadas o pendientes.

**Headers:**
```
Authorization: Bearer {token}
```

**Query params:**
- `groupId` (requerido): ID del grupo
- `page` (opcional): número de página
- `pageSize` (opcional): items por página

**Respuesta 200 (éxito):**
```json
{
  "data": [
    {
      "groupId": 7,
      "experienceId": 10,
      "finalScore": 85,
      "attempts": 2,
      "status": "COMPLETED",
      "mandatory": true,
      "startedAt": "2026-04-10T14:30:00.000Z",
      "completedAt": "2026-04-10T14:45:00.000Z",
      "timeSpent": 872
    },
    {
      "groupId": 7,
      "experienceId": 11,
      "finalScore": null,
      "attempts": 0,
      "status": "PENDING",
      "mandatory": true,
      "startedAt": null,
      "completedAt": null,
      "timeSpent": null
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 2,
    "totalPages": 1
  }
}
```

**Respuesta 400 (error - falta groupId):**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [...]
}
```

**Dependencias:** Requiere token del paso 1. El `groupId` se obtiene del paso 4 (grupos del usuario).

---

## 4. Obtener Info del Bundle Addressable

**GET** `/experiences/:experienceId/addressable`

**Descripción:** El usuario accederá a este endpoint cuando necesite descargar el contenido XR de una experiencia. Unity usará esta info para cargar el bundle desde Addressables.

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta 200 (éxito):**
```json
{
  "experienceId": 10,
  "currentVersion": "1.2",
  "bundleUrl": "https://minio.local/addressables/exp-10/v1.2/",
  "catalogUrl": "https://minio.local/addressables/exp-10/v1.2/catalog.json",
  "sizeMb": 245,
  "updatedAt": "2026-04-15T09:00:00.000Z"
}
```

**Respuesta 404 (error - no existe addressable para esta experiencia):**
```json
{
  "statusCode": 404,
  "message": "Addressable for experience 10 not found",
  "error": "Not Found"
}
```

**Dependencias:** Requiere token del paso 1. El `experienceId` viene de la lista de experiencias (paso 3).

---

## 5. Iniciar Sesión de Experiencia

**POST** `/experiences/:experienceId/sessions`

**Descripción:** El usuario emitirá a este endpoint cuando comience una experiencia XR. Esto crea un session ID para trackear toda la telemetría.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "groupId": 7,
  "deviceType": "vr_headset",
  "platform": "Meta Quest 3 v62",
  "ipAddress": "192.168.1.105"
}
```

**Campos:**
- `groupId` (requerido): ID del grupo
- `deviceType` (opcional): `vr_headset`, `desktop`, `mobile`, `tablet`
- `platform` (opcional): versión del dispositivo
- `ipAddress` (opcional): IP del headset

**Respuesta 201 (éxito):**
```json
{
  "session_id": "cmog1aln70000lc8sjix8p4fl",
  "started_at": "2026-04-26T12:00:00.000Z",
  "experience_id": 10,
  "attempt_number": 2
}
```

**Respuesta 404 (error - experiencia no existe):**
```json
{
  "statusCode": 404,
  "message": "Experience #10 not found",
  "error": "Not Found"
}
```

**Dependencias:** Requiere token del paso 1. El `experienceId` viene de la lista de experiencias (paso 3). El `session_id` returned se usa en los pasos 6 y 7.

---

## 6. Enviar Eventos de Score

**POST** `/score-events`

**Descripción:** El usuario emitirá a este endpoint durante la evaluación, enviando las respuestas de cada pregunta en batch (cada 30 segundos o al terminar un caso).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "groupId": 7,
  "experienceId": 10,
  "sessionId": "cmog1aln70000lc8sjix8p4fl",
  "eventId": "caso-1-tipo-falla",
  "label": "Respuesta correcta",
  "scoreDelta": 10,
  "metadata": {
    "case_number": 1,
    "question_type": "failure_type",
    "is_correct": true,
    "response_time_seconds": 8.3
  }
}
```

**Campos:**
- `groupId` (requerido): ID del grupo
- `experienceId` (requerido): ID de la experiencia
- `sessionId` (requerido): session_id del paso 5
- `eventId` (requerido): identificador único del evento
- `label` (opcional): descripción breve
- `scoreDelta` (requerido): puntos ganados o perdidos
- `metadata` (opcional): datos adicionales del evento

**Respuesta 201 (éxito):**
```json
{
  "id": 156,
  "groupId": 7,
  "experienceId": 10,
  "sessionId": "cmog1aln70000lc8sjix8p4fl",
  "eventId": "caso-1-tipo-falla",
  "label": "Respuesta correcta",
  "scoreDelta": 10,
  "metadata": {...},
  "occurredAt": "2026-04-26T12:05:30.000Z"
}
```

**Respuesta 400 (error - validation failed):**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [...]
}
```

**Dependencias:** Requiere token del paso 1. El `sessionId` viene del paso 5.

---

## 7. Finalizar Sesión de Experiencia

**PATCH** `/sessions/:sessionId/complete`

**Descripción:** El usuario emitirá a este endpoint cuando termine la evaluación. Se actualiza el progreso del grupo-experiencia y las estadísticas.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "finalScore": 85,
  "totalTimeSeconds": 872,
  "totalCorrect": 7,
  "totalIncorrect": 2,
  "totalQuestions": 9,
  "cases": [
    {
      "caseNumber": 1,
      "failureName": "Rajadura en el borde",
      "typeCorrect": true,
      "causeCorrect": false,
      "recommendationCorrect": true,
      "caseTimeSeconds": 285
    }
  ],
  "interactionsCount": 47,
  "pauseCount": 1,
  "errorCount": 0,
  "rating": 4
}
```

**Respuesta 200 (éxito):**
```json
{
  "session_id": "cmog1aln70000lc8sjix8p4fl",
  "completed_at": "2026-04-26T12:14:32.000Z",
  "group_experience_updated": {
    "status": "completed",
    "final_score": 85,
    "attempts": 2,
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

**Respuesta 404 (error - sesión no existe):**
```json
{
  "statusCode": 404,
  "message": "Session cmog1aln70000lc8sjix8p4fl not found",
  "error": "Not Found"
}
```

**Dependencias:** Requiere token del paso 1. El `sessionId` viene del paso 5.

---

## 8. Registrar Activity Log

**POST** `/activity-log`

**Descripción:** El usuario emitirá a este endpoint para registrar acciones importantes (login, start_experience, complete_experience, etc.). Es fire-and-forget, no bloquea la UI.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request (single):**
```json
{
  "userId": "cmog1aln70000lc8sjix8p4fl",
  "orgId": 1,
  "action": "complete_experience",
  "entity": "Experience",
  "entityId": 10,
  "metadata": {
    "score": 85,
    "time": 872,
    "rating": 4
  },
  "ipAddress": "192.168.1.105"
}
```

**Request (batch):**
```json
{
  "events": [
    {
      "userId": "cmog1aln70000lc8sjix8p4fl",
      "orgId": 1,
      "action": "login",
      "metadata": { "method": "pin", "device": "Quest 3" },
      "ipAddress": "192.168.1.105"
    },
    {
      "userId": "cmog1aln70000lc8sjix8p4fl",
      "orgId": 1,
      "action": "start_experience",
      "entity": "Experience",
      "entityId": 10,
      "metadata": { "groupId": 7, "attempt": 2 },
      "ipAddress": "192.168.1.105"
    }
  ]
}
```

**Campos:**
- `userId` (requerido): ID del usuario (del token)
- `orgId` (requerido): ID de la organización (del token)
- `action` (requerido): tipo de acción (`login`, `start_experience`, `complete_experience`, etc.)
- `entity` (opcional): tipo de entidad (`Experience`, `Group`, etc.)
- `entityId` (opcional): ID de la entidad
- `metadata` (opcional): datos adicionales
- `ipAddress` (opcional): IP del dispositivo

**Respuesta 202 (éxito - aceptado para procesamiento):**
```json
{
  "id": 1,
  "userId": "cmog1aln70000lc8sjix8p4fl",
  "orgId": 1,
  "action": "complete_experience",
  "entity": "Experience",
  "entityId": 10,
  "metadata": {...},
  "ipAddress": "192.168.1.105",
  "createdAt": "2026-04-26T12:14:35.000Z"
}
```

**Respuesta 400 (error - falta userId u orgId):**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "path": ["userId"],
      "message": "Invalid input: expected string, received undefined"
    }
  ]
}
```

**Dependencias:** Requiere token del paso 1. El `userId` y `orgId` deben obtenerse del token o del paso 2.

---

## Flujo Completo Unity → API

```
1. LOGIN
   POST /xr-auth/validate-pin { pin: "482916" }
   → Guarda { token, user.id, user.orgId }

2. DATOS USUARIO
   GET /users/:userId
   → Verifica orgId

3. GRUPOS DEL USUARIO (para lista de grupos)
   GET /group-experiences?groupId=7
   → Obtiene lista de experiencias

4. POR CADA EXPERIENCIA:
   GET /experiences/:id/addressable
   → Obtiene bundle_url para Unity Addressables
   → Unity descarga: Addressables.LoadFromCatalog(catalog_url)

5. INICIAR EXPERIENCIA
   POST /experiences/10/sessions { groupId: 7, deviceType: "vr_headset" }
   → Guarda session_id

6. DURANTE EVALUACIÓN (batch cada 30s)
   POST /score-events { groupId: 7, experienceId: 10, sessionId: "xxx", ... }

7. FINALIZAR EXPERIENCIA
   PATCH /sessions/:sessionId/complete { finalScore: 85, ... }

8. REGISTRO DE ACTIVIDAD (al cerrar app)
   POST /activity-log { events: [...] }
```

---

## Códigos de Error Comunes

| Código | Significado | Acción |
|--------|-------------|--------|
| 400 | Validation failed | Revisar body/enviar campos requeridos |
| 401 | Unauthorized | Refresh token o re-login |
| 404 | Not found | Verificar IDs y existencia |
| 500 | Server error | Reintentar con exponential backoff |

---

## Notas de Implementación

### Retry Logic
- **Score events**: Guardar localmente si no hay conexión, reenviar al recuperar
- **Session complete**: Reintentar hasta 3 veces con backoff exponencial
- **Activity log**: Fire-and-forget, si falla se descarta

### Cache Invalidation
- Antes de iniciar experiencia, siempre llamar `GET /experiences/:id/addressable`
- Comparar `currentVersion` con versión local
- Si cambió, Unity debe recargar bundle

---

*Última actualización: Abril 2026*