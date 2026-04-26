# API Endpoints — RBAC Mapping

Roles disponibles:
- `SUPER_ADMIN` — Super Admin (plenos poderes sobre todas las organizaciones)
- `ORG_ADMIN` — Org Admin (administra su organización)
- `INSTRUCTOR` — Instructor (crea y gestiona experiencias educativas)
- `STUDENT` — Student (usuario final, consume experiencias)

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
| POST | /organizations | SUPER_ADMIN |
| GET | /organizations | SUPER_ADMIN |
| GET | /organizations/:id | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| PATCH | /organizations/:id | SUPER_ADMIN |
| DELETE | /organizations/:id | SUPER_ADMIN |

*Verificación de ownership por orgId en el service/repository

---

## Users

| Method | Path | Permission |
|--------|------|------------|
| POST | /users | SUPER_ADMIN, ORG_ADMIN |
| GET | /users | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| GET | /users/:id | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| PATCH | /users/:id | SUPER_ADMIN, ORG_ADMIN |
| DELETE | /users/:id | SUPER_ADMIN, ORG_ADMIN |

*ORG_ADMIN solo gestiona usuarios de su org. El filtrado va en service/repository.

---

## Roles

| Method | Path | Permission |
|--------|------|------------|
| GET | /roles | SUPER_ADMIN, ORG_ADMIN |
| GET | /roles/:id | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |

---

## Departments

| Method | Path | Permission |
|--------|------|------------|
| POST | /departments | SUPER_ADMIN, ORG_ADMIN |
| GET | /departments | SUPER_ADMIN, ORG_ADMIN |
| GET | /departments/:id | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| PATCH | /departments/:id | SUPER_ADMIN, ORG_ADMIN |
| DELETE | /departments/:id | SUPER_ADMIN, ORG_ADMIN |

---

## Specialties

| Method | Path | Permission |
|--------|------|------------|
| POST | /specialties | SUPER_ADMIN, ORG_ADMIN |
| GET | /specialties | SUPER_ADMIN, ORG_ADMIN |
| GET | /specialties/:id | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| PATCH | /specialties/:id | SUPER_ADMIN, ORG_ADMIN |
| DELETE | /specialties/:id | SUPER_ADMIN, ORG_ADMIN |

*Verificación de ownership por department/specialty en service/repository

---

## Courses

| Method | Path | Permission |
|--------|------|------------|
| POST | /courses | SUPER_ADMIN, ORG_ADMIN |
| GET | /courses | SUPER_ADMIN, ORG_ADMIN |
| GET | /courses/:id | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| PATCH | /courses/:id | SUPER_ADMIN, ORG_ADMIN |
| DELETE | /courses/:id | SUPER_ADMIN, ORG_ADMIN |

*Instructor/Student ven courses donde tienen Group membership

---

## Experiences

| Method | Path | Permission |
|--------|------|------------|
| POST | /experiences | SUPER_ADMIN, ORG_ADMIN |
| GET | /experiences | SUPER_ADMIN, ORG_ADMIN |
| GET | /experiences/:id | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| PATCH | /experiences/:id | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR |
| DELETE | /experiences/:id | SUPER_ADMIN, ORG_ADMIN |
| POST | /experiences/:experienceId/sessions | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| GET | /experiences/:experienceId/addressable | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |

*Instructor no puede crear/eliminar, solo actualizar datos. Student solo ve experiencias asignadas.

---

## Groups

| Method | Path | Permission |
|--------|------|------------|
| POST | /groups | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR |
| GET | /groups | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR |
| GET | /groups/:id | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| PATCH | /groups/:id | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR |
| DELETE | /groups/:id | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR |

*Student solo ve grupos a los que pertenece (no el listado general)

---

## User-Groups

| Method | Path | Permission |
|--------|------|------------|
| POST | /user-groups | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR |
| GET | /user-groups | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR |
| GET | /user-groups/:userId/:groupId | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| PATCH | /user-groups/:userId/:groupId | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR |
| DELETE | /user-groups/:userId/:groupId | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR |

*Student solo ve asignaciones de grupos a los que pertenece

---

## Group-Experiences

| Method | Path | Permission |
|--------|------|------------|
| POST | /group-experiences | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR |
| GET | /group-experiences | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR |
| GET | /group-experiences/:groupId/:experienceId | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| PATCH | /group-experiences/:groupId/:experienceId | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR |
| DELETE | /group-experiences/:groupId/:experienceId | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR |

*Student solo ve experiencias asignadas a sus grupos

---

## Score-Events

| Method | Path | Permission |
|--------|------|------------|
| POST | /score-events | STUDENT |
| GET | /score-events | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| GET | /score-events/session/:sessionId | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| GET | /score-events/group/:groupId/experience/:experienceId | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| GET | /score-events/:id | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| DELETE | /score-events/:id | SUPER_ADMIN, ORG_ADMIN |

*POST desde Unity/VR authenticado como STUDENT (XR device = estudiante logueado)

---

## Telemetry

| Method | Path | Permission |
|--------|------|------------|
| POST | /telemetry/session | STUDENT |

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
| PATCH | /sessions/:sessionId/complete | INSTRUCTOR, STUDENT |
| GET | /sessions/:sessionId | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |

---

## Addressables

| Method | Path | Permission |
|--------|------|------------|
| POST | /addressables | SUPER_ADMIN, ORG_ADMIN |
| GET | /addressables | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| GET | /addressables/:id | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR, STUDENT |
| PATCH | /addressables/:id | SUPER_ADMIN, ORG_ADMIN, INSTRUCTOR |
| DELETE | /addressables/:id | SUPER_ADMIN, ORG_ADMIN |

*Instructor no puede crear/eliminar, solo modificar y ver. Student solo ve addressables de experiencias asignadas.

---

## Activity-Log

| Method | Path | Permission |
|--------|------|------------|
| POST | /activity-log | PUBLIC* |
| POST | /activity-log/batch | PUBLIC* |
| GET | /activity-log | SUPER_ADMIN, ORG_ADMIN |
| GET | /activity-log/:id | SUPER_ADMIN, ORG_ADMIN |

*POST es llamado internamente por el sistema (audit interceptor), no directamente por usuarios.

---

## App

| Method | Path | Permission |
|--------|------|------------|
| GET | / | PUBLIC |

---

## Instrucciones

Completá la columna `Permission` con el rol requerido:
- `SUPER_ADMIN`
- `ORG_ADMIN`
- `INSTRUCTOR`
- `STUDENT`
- `PUBLIC` (sin autenticación)

Podés usar múltiples roles separados por coma: `ORG_ADMIN, INSTRUCTOR`