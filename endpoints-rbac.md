# API Endpoints — RBAC Mapping (Granular)

Roles disponibles:
- `SUPER_ADMIN` — Super Admin (plenos poderes sobre todas las organizaciones)
- `ORG_ADMIN` — Org Admin (administra su organización)
- `INSTRUCTOR` — Instructor (crea y gestiona experiencias educativas)
- `STUDENT` — Student (usuario final, consume experiencias)

---

## Matriz de Permisos por Rol

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

## Auth

| Method | Path | Permission |
|--------|------|------------|
| POST | /auth/sign-up | PUBLIC |
| POST | /auth/sign-in | PUBLIC |
| POST | /auth/sign-out | PUBLIC* |
| GET | /auth/me | PUBLIC* |

*sign-out y me requieren autenticación (AuthGuard valida sesión, no rol)

---

## Organizations

| Method | Path | Permission |
|--------|------|------------|
| POST | /organizations | organization:create |
| GET | /organizations | organization:read |
| GET | /organizations/:id | organization:read |
| PATCH | /organizations/:id | organization:update |
| DELETE | /organizations/:id | organization:delete |

---

## Users

| Method | Path | Permission |
|--------|------|------------|
| POST | /users | user:create |
| GET | /users | user:read |
| GET | /users/:id | user:read |
| PATCH | /users/:id | user:update |
| DELETE | /users/:id | user:delete |

---

## Roles

| Method | Path | Permission |
|--------|------|------------|
| GET | /roles | role:read |
| GET | /roles/:id | role:read |

---

## Departments

| Method | Path | Permission |
|--------|------|------------|
| POST | /departments | department:create |
| GET | /departments | department:read |
| GET | /departments/:id | department:read |
| PATCH | /departments/:id | department:update |
| DELETE | /departments/:id | department:delete |

---

## Specialties

| Method | Path | Permission |
|--------|------|------------|
| POST | /specialties | specialty:create |
| GET | /specialties | specialty:read |
| GET | /specialties/:id | specialty:read |
| PATCH | /specialties/:id | specialty:update |
| DELETE | /specialties/:id | specialty:delete |

---

## Courses

| Method | Path | Permission |
|--------|------|------------|
| POST | /courses | course:create |
| GET | /courses | course:read |
| GET | /courses/:id | course:read |
| PATCH | /courses/:id | course:update |
| DELETE | /courses/:id | course:delete |

---

## Experiences

| Method | Path | Permission |
|--------|------|------------|
| POST | /experiences | experience:create |
| GET | /experiences | experience:read |
| GET | /experiences/:id | experience:read |
| PATCH | /experiences/:id | experience:update |
| DELETE | /experiences/:id | experience:delete |
| POST | /experiences/:experienceId/sessions | experience:session |
| GET | /experiences/:experienceId/addressable | experience:addressable |

---

## Groups

| Method | Path | Permission |
|--------|------|------------|
| POST | /groups | group:create |
| GET | /groups | group:read |
| GET | /groups/:id | group:read |
| PATCH | /groups/:id | group:update |
| DELETE | /groups/:id | group:delete |

---

## User-Groups

| Method | Path | Permission |
|--------|------|------------|
| POST | /user-groups | user-group:create |
| GET | /user-groups | user-group:read |
| GET | /user-groups/:userId/:groupId | user-group:read |
| PATCH | /user-groups/:userId/:groupId | user-group:update |
| DELETE | /user-groups/:userId/:groupId | user-group:delete |

---

## Group-Experiences

| Method | Path | Permission |
|--------|------|------------|
| POST | /group-experiences | group-experience:create |
| GET | /group-experiences | group-experience:read |
| GET | /group-experiences/:groupId/:experienceId | group-experience:read |
| PATCH | /group-experiences/:groupId/:experienceId | group-experience:update |
| DELETE | /group-experiences/:groupId/:experienceId | group-experience:delete |

---

## Score-Events

| Method | Path | Permission |
|--------|------|------------|
| POST | /score-events | score-event:create |
| GET | /score-events | score-event:read |
| GET | /score-events/session/:sessionId | score-event:read |
| GET | /score-events/group/:groupId/experience/:experienceId | score-event:read |
| GET | /score-events/:id | score-event:read |
| DELETE | /score-events/:id | score-event:delete |

---

## Telemetry

| Method | Path | Permission |
|--------|------|------------|
| POST | /telemetry/session | telemetry:create |

---

## XR-Auth

| Method | Path | Permission |
|--------|------|------------|
| POST | /xr-auth/generate-pin | PUBLIC* |
| POST | /xr-auth/validate-pin | PUBLIC* |

*generate-pin requiere usuario autenticado. validate-pin es público (PIN + device).

---

## Sessions

| Method | Path | Permission |
|--------|------|------------|
| PATCH | /sessions/:sessionId/complete | session:update |
| GET | /sessions/:sessionId | session:read |

---

## Addressables

| Method | Path | Permission |
|--------|------|------------|
| POST | /addressables | addressable:create |
| GET | /addressables | addressable:read |
| GET | /addressables/:id | addressable:read |
| PATCH | /addressables/:id | addressable:update |
| DELETE | /addressables/:id | addressable:delete |

---

## Activity-Log

| Method | Path | Permission |
|--------|------|------------|
| POST | /activity-log | PUBLIC* |
| POST | /activity-log/batch | PUBLIC* |
| GET | /activity-log | activity-log:read |
| GET | /activity-log/:id | activity-log:read |

*POST es llamado internamente por el sistema (audit interceptor), no directamente por usuarios.

---

## App

| Method | Path | Permission |
|--------|------|------------|
| GET | / | PUBLIC |

---

## Convenciones

- Formato de permiso: `recurso:accion`
- Acciones disponibles: `create`, `read`, `update`, `delete`
- Acciones especiales: `session`, `addressable`, `telemetry` (vienen de operaciones específicas)
- PUBLIC = endpoint sin autenticación
