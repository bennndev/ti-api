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
| POST | /auth/sign-out | PUBLIC |
| GET | /auth/me | ??? |

---

## Organizations

| Method | Path | Permission |
|--------|------|------------|
| POST | /organizations | ??? |
| GET | /organizations | ??? |
| GET | /organizations/:id | ??? |
| PATCH | /organizations/:id | ??? |
| DELETE | /organizations/:id | ??? |

---

## Users

| Method | Path | Permission |
|--------|------|------------|
| POST | /users | ??? |
| GET | /users | ??? |
| GET | /users/:id | ??? |
| PATCH | /users/:id | ??? |
| DELETE | /users/:id | ??? |

---

## Roles

| Method | Path | Permission |
|--------|------|------------|
| GET | /roles | ??? |
| GET | /roles/:id | ??? |

---

## Departments

| Method | Path | Permission |
|--------|------|------------|
| POST | /departments | ??? |
| GET | /departments | ??? |
| GET | /departments/:id | ??? |
| PATCH | /departments/:id | ??? |
| DELETE | /departments/:id | ??? |

---

## Specialties

| Method | Path | Permission |
|--------|------|------------|
| POST | /specialties | ??? |
| GET | /specialties | ??? |
| GET | /specialties/:id | ??? |
| PATCH | /specialties/:id | ??? |
| DELETE | /specialties/:id | ??? |

---

## Courses

| Method | Path | Permission |
|--------|------|------------|
| POST | /courses | ??? |
| GET | /courses | ??? |
| GET | /courses/:id | ??? |
| PATCH | /courses/:id | ??? |
| DELETE | /courses/:id | ??? |

---

## Experiences

| Method | Path | Permission |
|--------|------|------------|
| POST | /experiences | ??? |
| GET | /experiences | ??? |
| GET | /experiences/:id | ??? |
| PATCH | /experiences/:id | ??? |
| DELETE | /experiences/:id | ??? |
| POST | /experiences/:experienceId/sessions | ??? |
| GET | /experiences/:experienceId/addressable | ??? |

---

## Groups

| Method | Path | Permission |
|--------|------|------------|
| POST | /groups | ??? |
| GET | /groups | ??? |
| GET | /groups/:id | ??? |
| PATCH | /groups/:id | ??? |
| DELETE | /groups/:id | ??? |

---

## User-Groups

| Method | Path | Permission |
|--------|------|------------|
| POST | /user-groups | ??? |
| GET | /user-groups | ??? |
| GET | /user-groups/:userId/:groupId | ??? |
| PATCH | /user-groups/:userId/:groupId | ??? |
| DELETE | /user-groups/:userId/:groupId | ??? |

---

## Group-Experiences

| Method | Path | Permission |
|--------|------|------------|
| POST | /group-experiences | ??? |
| GET | /group-experiences | ??? |
| GET | /group-experiences/:groupId/:experienceId | ??? |
| PATCH | /group-experiences/:groupId/:experienceId | ??? |
| DELETE | /group-experiences/:groupId/:experienceId | ??? |

---

## Score-Events

| Method | Path | Permission |
|--------|------|------------|
| POST | /score-events | ??? |
| GET | /score-events | ??? |
| GET | /score-events/session/:sessionId | ??? |
| GET | /score-events/group/:groupId/experience/:experienceId | ??? |
| GET | /score-events/:id | ??? |
| DELETE | /score-events/:id | ??? |

---

## Telemetry

| Method | Path | Permission |
|--------|------|------------|
| POST | /telemetry/session | ??? |

---

## XR-Auth

| Method | Path | Permission |
|--------|------|------------|
| POST | /xr-auth/generate-pin | ??? |
| POST | /xr-auth/validate-pin | ??? |

---

## Sessions

| Method | Path | Permission |
|--------|------|------------|
| PATCH | /sessions/:sessionId/complete | ??? |
| GET | /sessions/:sessionId | ??? |

---

## Addressables

| Method | Path | Permission |
|--------|------|------------|
| POST | /addressables | ??? |
| GET | /addressables | ??? |
| GET | /addressables/:id | ??? |
| PATCH | /addressables/:id | ??? |
| DELETE | /addressables/:id | ??? |

---

## Activity-Log

| Method | Path | Permission |
|--------|------|------------|
| POST | /activity-log | ??? |
| POST | /activity-log/batch | ??? |
| GET | /activity-log | ??? |
| GET | /activity-log/:id | ??? |

---

## App

| Method | Path | Permission |
|--------|------|------------|
| GET | / | ??? |

---

## Instrucciones

Completá la columna `Permission` con el rol requerido:
- `SUPER_ADMIN`
- `ORG_ADMIN`
- `INSTRUCTOR`
- `STUDENT`
- `PUBLIC` (sin autenticación)

Podés usar múltiples roles separados por coma: `ORG_ADMIN, INSTRUCTOR`