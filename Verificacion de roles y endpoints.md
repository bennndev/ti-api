# Verificación de Roles y Endpoints

## Resumen de Roles

| Rol | ID | Descripción |
|-----|-----|-------------|
| super_admin | 1 | Plenos poderes. Solo para desarrollo. |
| org_admin | 2 | Administrador de organización. Gestiona usuarios y contenidos de su org. |
| instructor | 3 | Crea y gestiona experiencias educativas. No administra usuarios. |
| student | 4 | Usuario final. Consume experiencias y ve su progreso. |

---

## Permisos por Rol

### super_admin (roleId=1)
- **TODOS los permisos** del sistema
- Puede crear, leer, actualizar, eliminar cualquier recurso en cualquier organización

### org_admin (roleId=2)
| Módulo | Permisos |
|--------|----------|
| Users | create, read, update, delete |
| Roles | read |
| Department | create, read, update, delete |
| Specialty | create, read, update, delete |
| Course | create, read, update, delete |
| Experience | create, read, update, delete, session, addressable |
| Group | create, read, update, delete |
| User-Group | create, read, update, delete |
| Group-Experience | create, read, update, delete |
| Score-Event | read, delete |
| Session | read |
| Addressable | create, read, update, delete |
| Activity-Log | read |

### instructor (roleId=3)
| Módulo | Permisos |
|--------|----------|
| Experience | read, update, session |
| Group | create, read, update, delete |
| User-Group | create, read, update, delete |
| Group-Experience | create, read, update, delete |
| Score-Event | read |
| Session | read, update |
| Addressable | read, update |
| Role | read |

### student (roleId=4)
| Módulo | Permisos |
|--------|----------|
| User | read (solo propio) |
| Role | read |
| Experience | session |
| Group | read (solo grupos propios) |
| User-Group | read (solo membresías propias) |
| Group-Experience | read (solo grupos propios) |
| Score-Event | create, read |
| Session | read, update |
| Addressable | read |
| Telemetry | create |

---

## Flujo de Prueba por Rol

### Login común para todos
```
POST /auth/sign-in
Body: { "email": "...", "password": "..." }
Response: { token, user }
```

---

## super_admin (roleId=1)

### Endpoints que DEBE poder ejecutar (todos los permisos):

#### Organizations
- `POST /organizations` - Crear organización
- `GET /organizations` - Listar organizaciones
- `GET /organizations/:id` - Ver organización
- `PATCH /organizations/:id` - Actualizar organización
- `DELETE /organizations/:id` - Eliminar organización

#### Departments
- `POST /departments` - Crear departamento
- `GET /departments` - Listar departamentos
- `GET /departments/:id` - Ver departamento
- `PATCH /departments/:id` - Actualizar departamento
- `DELETE /departments/:id` - Eliminar departamento

#### Specialties
- `POST /specialties` - Crear especialidad
- `GET /specialties` - Listar especialidades
- `GET /specialties/:id` - Ver especialidad
- `PATCH /specialties/:id` - Actualizar especialidad
- `DELETE /specialties/:id` - Eliminar especialidad

#### Courses
- `POST /courses` - Crear curso
- `GET /courses` - Listar cursos
- `GET /courses/:id` - Ver curso
- `PATCH /courses/:id` - Actualizar curso
- `DELETE /courses/:id` - Eliminar curso

#### Experiences
- `POST /experiences` - Crear experiencia
- `GET /experiences` - Listar experiencias
- `GET /experiences/:id` - Ver experiencia
- `PATCH /experiences/:id` - Actualizar experiencia
- `DELETE /experiences/:id` - Eliminar experiencia

#### Groups
- `POST /groups` - Crear grupo
- `GET /groups` - Listar grupos
- `GET /groups/:id` - Ver grupo
- `PATCH /groups/:id` - Actualizar grupo
- `DELETE /groups/:id` - Eliminar grupo

#### Users
- `POST /users` - Crear usuario
- `GET /users` - Listar usuarios
- `GET /users/:id` - Ver usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

#### Todos los demás endpoints del sistema

---

## org_admin (roleId=2)

### Endpoints que DEBE poder ejecutar:

#### Organizations
- `GET /organizations` - Listar organizaciones
- `GET /organizations/:id` - Ver organización
- `PATCH /organizations/:id` - Actualizar organización

#### Departments
- `POST /departments` - Crear departamento ✓
- `GET /departments` - Listar departamentos ✓
- `GET /departments/:id` - Ver departamento ✓
- `PATCH /departments/:id` - Actualizar departamento ✓
- `DELETE /departments/:id` - Eliminar departamento ✓

#### Specialties
- `POST /specialties` - Crear especialidad ✓
- `GET /specialties` - Listar especialidades ✓
- `GET /specialties/:id` - Ver especialidad ✓
- `PATCH /specialties/:id` - Actualizar especialidad ✓
- `DELETE /specialties/:id` - Eliminar especialidad ✓

#### Courses
- `POST /courses` - Crear curso ✓
- `GET /courses` - Listar cursos ✓
- `GET /courses/:id` - Ver curso ✓
- `PATCH /courses/:id` - Actualizar curso ✓
- `DELETE /courses/:id` - Eliminar curso ✓

#### Experiences
- `POST /experiences` - Crear experiencia ✓
- `GET /experiences` - Listar experiencias ✓
- `GET /experiences/:id` - Ver experiencia ✓
- `PATCH /experiences/:id` - Actualizar experiencia ✓
- `DELETE /experiences/:id` - Eliminar experiencia ✓

#### Groups
- `POST /groups` - Crear grupo ✓
- `GET /groups` - Listar grupos ✓
- `GET /groups/:id` - Ver grupo ✓
- `PATCH /groups/:id` - Actualizar grupo ✓
- `DELETE /groups/:id` - Eliminar grupo ✓

#### User-Groups
- `POST /user-groups` - Crear membresía ✓
- `GET /user-groups` - Listar membresías ✓
- `PATCH /user-groups/:userId/:groupId` - Actualizar membresía ✓
- `DELETE /user-groups/:userId/:groupId` - Eliminar membresía ✓

#### Group-Experiences
- `POST /group-experiences` - Crear grupo-experiencia ✓
- `GET /group-experiences` - Listar grupo-experiencias ✓
- `PATCH /group-experiences/:groupId/:experienceId` - Actualizar ✓
- `DELETE /group-experiences/:groupId/:experienceId` - Eliminar ✓

#### Users
- `POST /users` - Crear usuario ✓
- `GET /users` - Listar usuarios ✓
- `GET /users/:id` - Ver usuario ✓
- `PATCH /users/:id` - Actualizar usuario ✓
- `DELETE /users/:id` - Eliminar usuario ✓

#### Score-Events
- `GET /score-events` - Listar eventos ✓
- `DELETE /score-events/:id` - Eliminar evento ✓

#### Sessions
- `GET /sessions/:sessionId` - Ver sesión ✓

#### Addressables
- `POST /addressables` - Crear addressable ✓
- `GET /addressables` - Listar addressables ✓
- `GET /addressables/:id` - Ver addressable ✓
- `PATCH /addressables/:id` - Actualizar addressable ✓
- `DELETE /addressables/:id` - Eliminar addressable ✓

#### Activity-Log
- `GET /activity-log` - Ver logs ✓

#### Roles
- `GET /roles` - Listar roles ✓
- `GET /roles/:id` - Ver rol ✓

---

### Endpoints que NO DEBE poder ejecutar:

- `POST /organizations` - ❌ (solo super_admin)
- `DELETE /organizations/:id` - ❌ (solo super_admin)
- `POST /score-events` - ❌ (no tiene score-event:create)

---

## instructor (roleId=3)

### Endpoints que DEBE poder ejecutar:

#### Experiences
- `GET /experiences` - Listar experiencias ✓
- `GET /experiences/:id` - Ver experiencia ✓
- `PATCH /experiences/:id` - Actualizar experiencia ✓
- `POST /experiences/:experienceId/sessions` - Iniciar sesión ✓

#### Groups
- `POST /groups` - Crear grupo ✓
- `GET /groups` - Listar grupos ✓
- `GET /groups/:id` - Ver grupo ✓
- `PATCH /groups/:id` - Actualizar grupo ✓
- `DELETE /groups/:id` - Eliminar grupo ✓

#### User-Groups
- `POST /user-groups` - Crear membresía ✓
- `GET /user-groups` - Listar membresías ✓
- `PATCH /user-groups/:userId/:groupId` - Actualizar membresía ✓
- `DELETE /user-groups/:userId/:groupId` - Eliminar membresía ✓

#### Group-Experiences
- `POST /group-experiences` - Crear grupo-experiencia ✓
- `GET /group-experiences` - Listar grupo-experiencias ✓
- `PATCH /group-experiences/:groupId/:experienceId` - Actualizar ✓
- `DELETE /group-experiences/:groupId/:experienceId` - Eliminar ✓

#### Sessions
- `GET /sessions/:sessionId` - Ver sesión ✓
- `PATCH /sessions/:sessionId/complete` - Completar sesión ✓

#### Addressables
- `GET /addressables` - Listar addressables ✓
- `GET /addressables/:id` - Ver addressable ✓
- `PATCH /addressables/:id` - Actualizar addressable ✓

#### Roles
- `GET /roles` - Listar roles ✓
- `GET /roles/:id` - Ver rol ✓

#### Score-Events
- `GET /score-events` - Listar eventos ✓
- `GET /score-events/session/:sessionId` - Ver eventos por sesión ✓
- `GET /score-events/group/:groupId/experience/:experienceId` - Ver eventos ✓

#### Experiences
- `GET /experiences/:experienceId/addressable` - Ver addressable ✓

---

### Endpoints que NO DEBE poder ejecutar:

- `POST /organizations` - ❌
- `POST /departments` - ❌
- `POST /specialties` - ❌
- `POST /courses` - ❌
- `POST /experiences` - ❌
- `POST /users` - ❌
- `POST /addressables` - ❌
- `DELETE` en cualquier recurso - ❌
- `GET /activity-log` - ❌ (no tiene activity-log:read)

---

## student (roleId=4)

### Endpoints que DEBE poder ejecutar:

#### Auth
- `GET /auth/me` - Ver perfil propio ✓

#### Users
- `GET /users/:id` - Ver usuario (solo propio) ✓

#### Roles
- `GET /roles` - Listar roles ✓
- `GET /roles/:id` - Ver rol ✓

#### Experiences
- `POST /experiences/:experienceId/sessions` - Iniciar sesión XR ✓

#### Groups
- `GET /groups` - Listar grupos (solo propios) ✓
- `GET /groups/:id` - Ver grupo (propio) ✓

#### User-Groups
- `GET /user-groups` - Listar membresías (propias) ✓

#### Group-Experiences
- `GET /group-experiences` - Listar grupo-experiencias (propias) ✓

#### Score-Events
- `POST /score-events` - Crear evento (VR) ✓
- `GET /score-events` - Listar eventos ✓
- `GET /score-events/session/:sessionId` - Ver eventos por sesión ✓

#### Sessions
- `GET /sessions/:sessionId` - Ver sesión ✓
- `PATCH /sessions/:sessionId/complete` - Completar sesión ✓

#### Addressables
- `GET /addressables` - Listar addressables ✓
- `GET /addressables/:id` - Ver addressable ✓

#### Experiences
- `GET /experiences/:experienceId/addressable` - Ver addressable ✓

#### Telemetry
- `POST /telemetry/session` - Enviar telemetría ✓

---

### Endpoints que NO DEBE poder ejecutar:

- `POST /organizations` - ❌
- `POST /departments` - ❌
- `POST /specialties` - ❌
- `POST /courses` - ❌
- `POST /experiences` - ❌
- `POST /groups` - ❌
- `POST /users` - ❌
- `POST /user-groups` - ❌
- `POST /group-experiences` - ❌
- `POST /addressables` - ❌
- `POST /activity-log` - ❌
- `PATCH /users/:id` - ❌ (no tiene user:update)
- `DELETE` en cualquier recurso - ❌

---

## Matriz Resumen de Endpoints

| Endpoint | super_admin | org_admin | instructor | student |
|----------|-------------|------------|------------|---------|
| POST /organizations | ✓ | ❌ | ❌ | ❌ |
| GET /organizations | ✓ | ✓ | ❌ | ❌ |
| POST /departments | ✓ | ✓ | ❌ | ❌ |
| GET /departments | ✓ | ✓ | ❌ | ❌ |
| POST /specialties | ✓ | ✓ | ❌ | ❌ |
| GET /specialties | ✓ | ✓ | ❌ | ❌ |
| POST /courses | ✓ | ✓ | ❌ | ❌ |
| GET /courses | ✓ | ✓ | ❌ | ❌ |
| POST /experiences | ✓ | ✓ | ❌ | ❌ |
| GET /experiences | ✓ | ✓ | ✓ | ❌ |
| PATCH /experiences/:id | ✓ | ✓ | ✓ | ❌ |
| POST /groups | ✓ | ✓ | ✓ | ❌ |
| GET /groups | ✓ | ✓ | ✓ | ✓ |
| POST /users | ✓ | ✓ | ❌ | ❌ |
| GET /users | ✓ | ✓ | ❌ | ❌ |
| POST /experiences/:id/sessions | ✓ | ✓ | ✓ | ✓ |
| GET /sessions/:id | ✓ | ✓ | ✓ | ✓ |
| PATCH /sessions/:id/complete | ✓ | ✓ | ✓ | ✓ |
| POST /score-events | ✓ | ❌ | ❌ | ✓ |
| GET /score-events | ✓ | ✓ | ✓ | ✓ |
| POST /telemetry/session | ✓ | ❌ | ❌ | ✓ |
| GET /addressables | ✓ | ✓ | ✓ | ✓ |

---

## Cómo hacer la prueba

### 1. Login con cada rol

```bash
# Super Admin
curl -X POST http://localhost:3000/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"super@admin.com","password":"password"}'

# Org Admin
curl -X POST http://localhost:3000/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@org.com","password":"password"}'

# Instructor
curl -X POST http://localhost:3000/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"instructor@org.com","password":"password"}'

# Student
curl -X POST http://localhost:3000/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"estudiante@org.com","password":"password"}'
```

### 2. Usar el token para requests protegidas

```bash
curl -X GET http://localhost:3000/groups \
  -H "Authorization: Bearer <TOKEN>"
```

### 3. Verificar respuesta

- **200 OK** → El endpoint permitió el acceso (permiso existe)
- **403 Forbidden** → El endpoint denegó el acceso (permiso no existe o rol no tiene acceso)
- **401 Unauthorized** → No hay sesión activa o token inválido

---

## Verificación esperada para student (roleId=4)

### Endpoints que deben retornar 200:
```
GET /auth/me
GET /roles
GET /groups
GET /groups/:id
GET /user-groups
GET /group-experiences
POST /experiences/:id/sessions
GET /sessions/:id
PATCH /sessions/:id/complete
POST /score-events
GET /score-events
GET /addressables
GET /addressables/:id
GET /experiences/:id/addressable
POST /telemetry/session
```

### Endpoints que deben retornar 403:
```
POST /organizations
POST /departments
POST /specialties
POST /courses
POST /experiences
POST /groups
POST /users
POST /user-groups
POST /group-experiences
POST /addressables
PATCH /groups/:id
DELETE /groups/:id
```