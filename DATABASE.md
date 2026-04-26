# ti-api — Base de Datos

> Monolito escalable preparado para arquitectura de microservicios.
> Stack: NestJS v11 + Prisma 7 + Neon PostgreSQL + Better Auth

---

## Índice

1. [Stack tecnológico](#stack-tecnológico)
2. [Decisiones arquitectónicas](#decisiones-arquitectónicas)
3. [Modelo de datos completo](#modelo-de-datos-completo)
4. [Integración Better Auth](#integración-better-auth)
5. [Configuración de Neon PostgreSQL](#configuración-de-neon-postgresql)
6. [Notas sobre Prisma 7](#notas-sobre-prisma-7)

---

## Stack tecnológico

### Versiones y dependencias

```json
{
  "dependencies": {
    "nestjs": "v11",
    "@nestjs/common": "^11.0.1",
    "@nestjs/core": "^11.0.1",
    "@nestjs/platform-express": "^11.0.1",
    "@nestjs/swagger": "^5.0.0",

    "prisma": "^7.8.0",
    "@prisma/client": "^7.8.0",
    "@prisma/adapter-neon": "^7.8.0",

    "better-auth": "^1.6.9",
    "@better-auth/prisma-adapter": "^1.0.0",

    "jose": "^6.2.2",
    "zod": "^4.3.6",
    "pino": "^10.3.1",
    "nestjs-pino": "^9.0.0",

    "dotenv": "^17.4.2"
  },
  "devDependencies": {
    "typescript": "^5.7.3",
    "tsx": "^4.0.0",
    "@prisma/seed": "^7.8.0"
  }
}
```

### Arquitectura de capas

```
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                              │
│  NestJS v11 + Controllers + Services + DTOs (Zod)          │
├─────────────────────────────────────────────────────────────┤
│                   Documentation Layer                       │
│  @nestjs/swagger → OpenAPI 3.0 (Swagger UI)                 │
├─────────────────────────────────────────────────────────────┤
│                     Auth Layer                              │
│  Better Auth + @better-auth/prisma-adapter                  │
│  OAuth (Google, Apple) + Email/Password + JWT (jose)         │
├─────────────────────────────────────────────────────────────┤
│                    ORM Layer                                 │
│  Prisma 7 + @prisma/adapter-neon                            │
│  Generated client → generated/prisma                        │
├─────────────────────────────────────────────────────────────┤
│                    Database Layer                           │
│  Neon PostgreSQL (Serverless, pooled connections)            │
└─────────────────────────────────────────────────────────────┘
```

### Logging

- **nestjs-pino** + **pino** para logging estructurado JSON
- Request context en cada log (trace ID, user ID, org ID)
- Output: JSON en producción, pino-pretty en desarrollo

### Validación

- **Zod v4** para validación runtime
- **@nestjs/swagger** para generación automática de schemas OpenAPI
- No usar `class-validator` (no es compatible con Prisma 7)

---

## Decisiones arquitectónicas

### Multi-tenant

Todas las entidades relevantes tienen `org_id` como ancla de aislamiento. Esto permite:

- Queries filtradas por organización
- Migración futura a schemas separados por tenant
- Lógica de negocio aislada por org sin overhead de microservicios

### Neon PostgreSQL

**Por qué Neon:**

- Serverless Postgres (escala automáticamente)
- Connection pooling integrado (-pooler suffix)
- Dos connection strings: pooled (runtime) + direct (CLI)

**Configuración de conexiones:**

```env
# Pooled connection — para runtime de la aplicación
DATABASE_URL="postgresql://user:pass@endpoint-pooler.region.neon.tech/dbname?sslmode=require"

# Direct connection — para Prisma CLI (migrate, generate)
DIRECT_URL="postgresql://user:pass@endpoint.region.neon.tech/dbname?sslmode=require"
```

### Integración Better Auth

**Better Auth administra:**

- `User` base (auth)
- `Session`, `Account`, `Verification` (oauth, sessions)
- Schema extensions via `additionalFields` para campos de negocio

**Esta base de datos administra:**

- Entidades de dominio (Organization, Department, Specialty, Course, Experience, Group)
- RBAC propio (Role, Permission, Role_Permission)
- Telefonos y emails (Contact)
- Tracking y auditoría

### Bounded contexts (preparado para microservicios)

```
├── auth-context        → User (auth), Session, Account, Verification
├── organization-context → Organization, Department, Specialty, Course
├── learning-context     → Experience, Group, User_Group, Group_Experience
├── rbac-context        → Role, Permission, Role_Permission
├── contact-context     → Phone, Email
└── audit-context       → Activity_Log
```

---

## Modelo de datos completo

---

### Organization

Organización/empresa (ej: TECSUP, Certus). Es el tenant root.

```prisma
model Organization {
  id            Int       @id @default(autoincrement())
  name          String    @db.VarChar(25)
  slug          String    @unique @db.VarChar(100)
  ruc           String    @unique @db.VarChar(20)
  logo          String    @db.VarChar(255)
  country       String    @db.VarChar(48)
  status        Boolean   @default(true)
  lastActivityAt DateTime?
  totalUsers    Int       @default(0)
  totalGroups   Int       @default(0)
  storageUsedMb Float?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  // Relations
  departments Department[]
  groups      Group[]
  users       User[]
  phones      Phone[]
  emails      Email[]
  activityLogs Activity_Log[]

  @@index([slug])
  @@index([status])
}
```

**Nota:** No se usa el `organization` de Better Auth porque necesitamos campos custom (RUC, país, contadores, etc.)

---

### User

Usuario del sistema. Relacionado 1:1 con el `user` de Better Auth (comparte el ID).

**Better Auth crea el registro base** (`user` table), esta tabla extiende con campos de negocio.

```prisma
model User {
  id        Int     @id @default(autoincrement())
  orgId     Int
  roleId    Int
  username  String  @unique @db.VarChar(50)

  // Documento de identidad
  documentType  String  @db.VarChar(4) // "DNI" | "RUC"
  documentNumber String @unique @db.VarChar(20)

  // Nombre completo
  firstName String @db.VarChar(50)
  lastName  String @db.VarChar(50)

  // Seguridad
  status            Boolean @default(true)
  lastLogin         DateTime?
  loginCount        Int     @default(0)
  failedLoginCount  Int     @default(0)
  lastIp            String? @db.VarChar(45)

  // Preferencias
  preferredLanguage String? @db.VarChar(10)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  // Relations
  org       Organization @relation(fields: [orgId], references: [id])
  role      Role         @relation(fields: [roleId], references: [id])
  phones    Phone[]
  emails    Email[]
  groups    User_Group[]
  activityLogs Activity_Log[]

  @@index([orgId])
  @@index([username])
  @@index([documentType, documentNumber])
  @@index([status])
}
```

**Integración Better Auth:**
- El `user.id` de Better Auth es el mismo que `User.id`
- Better Auth usa `email` para auth, nosotros tenemos `Email` como tabla separada para flexibilidad
- Los campos `firstName`, `lastName`, `documentType`, `documentNumber` se agregan como `additionalFields` en Better Auth

---

### Role

Roles del sistema (RBAC propio, no usar el `role` de Better Auth admin plugin).

```prisma
model Role {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(20)
  code        String   @unique @db.VarChar(20) // "super_admin" | "org_admin" | "instructor" | "student"
  description String?  @db.Text

  createdAt DateTime @default(now())

  // Relations
  users        User[]
  permissions  Role_Permission[]

  @@index([code])
}
```

---

### Permission

Permisos granulares del sistema.

```prisma
model Permission {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(100)  // Nombre legible: "Crear cursos"
  code        String   @unique @db.VarChar(50) // Código técnico: "course.create"
  module      String   @db.VarChar(50)   // Módulo: "experience", "group", "user"
  action      String   @db.VarChar(20)   // Acción: "create", "read", "update", "delete"
  description String?  @db.Text
  status      Boolean  @default(true)

  createdAt DateTime @default(now())

  // Relations
  roles Role_Permission[]

  @@index([module, action])
  @@index([code])
}
```

---

### Role_Permission

Relación N:M entre roles y permisos.

```prisma
model Role_Permission {
  permissionId Int
  roleId       Int

  permission Permission @relation(fields: [permissionId], references: [id])
  role       Role       @relation(fields: [roleId], references: [id])

  @@id([permissionId, roleId])
}
```

---

### Department

Departamento dentro de una organización (ej: "Tecnología Digital").

```prisma
model Department {
  id           Int        @id @default(autoincrement())
  orgId        Int
  name         String     @db.VarChar(25)
  description  String     @db.Text
  status       Boolean    @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  org       Organization @relation(fields: [orgId], references: [id])
  specialties Specialty[]

  @@index([orgId])
  @@index([status])
}
```

---

### Specialty

Especialidad dentro de un departamento (ej: "Diseño y Desarrollo de Software").

```prisma
model Specialty {
  id           Int      @id @default(autoincrement())
  departmentId Int
  name         String   @db.VarChar(25)
  code         String   @db.VarChar(10)
  description  String   @db.Text
  image        String?  @db.VarChar(255)
  status       Boolean  @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  department Department @relation(fields: [departmentId], references: [id])
  courses    Course[]

  @@index([departmentId])
  @@index([status])
}
```

---

### Course

Curso dentro de una especialidad (ej: "Desarrollo Web Avanzado").

```prisma
model Course {
  id           Int      @id @default(autoincrement())
  specialtyId  Int
  name         String   @db.VarChar(50)
  description  String   @db.Text
  image        String?  @db.VarChar(255)
  status       Boolean  @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  specialty   Specialty         @relation(fields: [specialtyId], references: [id])
  experiences Experience[]
  groups      Group[]

  @@index([specialtyId])
  @@index([status])
}
```

---

### Experience

Experiencia de aprendizaje XR/VR (examen, quiz, práctica, inducción).

```prisma
model Experience {
  id              Int       @id @default(autoincrement())
  courseId        Int
  name            String    @db.VarChar(50)
  description     String    @db.Text
  type            ExperienceType
  image           String?   @db.VarChar(255)

  // Metadatos de la experiencia
  duration        Int       // Duración en segundos
  score           Float     // Puntaje máximo posible
  attempts        Int       @default(1) // Intentos permitidos
  order           Int       // Posición dentro del curso

  // Desnormalizados para dashboards
  avgScore        Float?
  avgTimeSpent    Int?
  totalCompletions Int      @default(0)
  totalAttempts   Int       @default(0)

  // Calculado: difficulty = 1 - (completions / total_attempts)
  difficultyRating Float?

  status          ExperienceStatus @default(AVAILABLE)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  course        Course           @relation(fields: [courseId], references: [id])
  groupExperiences Group_Experience[]

  @@index([courseId])
  @@index([order])
  @@index([status])
}

enum ExperienceType {
  VR
  VIDEO
  DOCUMENT
  SLIDES
  INDUCTION
}

enum ExperienceStatus {
  AVAILABLE
  INACTIVE
}
```

---

### Group

Grupo de estudiantes asignado a un curso.

```prisma
model Group {
  id        Int      @id @default(autoincrement())
  orgId     Int
  courseId  Int
  name      String   @db.VarChar(50)
  code      String   @unique @db.VarChar(20)
  status    GroupStatus @default(ACTIVE)

  startDate DateTime?
  endDate   DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  org              Organization      @relation(fields: [orgId], references: [id])
  course           Course            @relation(fields: [courseId], references: [id])
  users            User_Group[]
  groupExperiences Group_Experience[]

  @@index([orgId])
  @@index([courseId])
  @@index([status])
}

enum GroupStatus {
  ACTIVE
  DISSOLVED
}
```

---

### User_Group

Relación N:M entre usuarios y grupos, con rol dentro del grupo.

```prisma
model User_Group {
  userId       Int
  groupId      Int
  roleInGroup  GroupRole?
  status       UserGroupStatus
  joinedAt     DateTime @default(now())

  user  User  @relation(fields: [userId], references: [id])
  group Group @relation(fields: [groupId], references: [id])

  @@id([userId, groupId])
}

enum GroupRole {
  LEADER
  MEMBER
}

enum UserGroupStatus {
  ACTIVE
  INACTIVE
  REMOVED
}
```

---

### Group_Experience

Tracking de progreso de un grupo en una experiencia específica.

```prisma
model Group_Experience {
  groupId       Int
  experienceId   Int

  // Scoring
  finalScore    Float?

  // tracking
  attempts      Int       @default(0)
  status        GroupExperienceStatus @default(PENDING)
  mandatory     Boolean   @default(false)

  startedAt     DateTime?
  completedAt   DateTime?
  timeSpent     Int?      // Segundos totales activos

  // Interacciones
  interactionsCount Int      @default(0)
  pauseCount        Int      @default(0)
  skipCount         Int      @default(0)

  // Dispositivo/sesión
  deviceType    DeviceType?
  platform      String?    @db.VarChar(50)
  ipAddress     String?   @db.VarChar(45)
  sessionId     String?   @db.VarChar(100)

  // Errores
  errorCount    Int       @default(0)

  group     Group     @relation(fields: [groupId], references: [id])
  experience Experience @relation(fields: [experienceId], references: [id])

  @@id([groupId, experienceId])
}

enum GroupExperienceStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
}

enum DeviceType {
  VR_HEADSET
  DESKTOP
  MOBILE
  TABLET
}
```

---

### Phone

Teléfono de contacto. Puede pertenecer a un User o a una Organization.

```prisma
model Phone {
  id           Int      @id @default(autoincrement())
  phone        String   @db.VarChar(15)
  type         PhoneType?
  isPrimary    Boolean  @default(false)
  userId       Int?
  organizationId Int?

  user         User?        @relation(fields: [userId], references: [id])
  organization Organization? @relation(fields: [organizationId], references: [id])

  @@index([userId])
  @@index([organizationId])
}

enum PhoneType {
  MOBILE
  LANDLINE
  WORK
}
```

---

### Email

Email de contacto. Puede pertenecer a un User o a una Organization.

```prisma
model Email {
  id              Int       @id @default(autoincrement())
  email           String    @unique @db.VarChar(255)
  type            EmailType?
  isPrimary       Boolean   @default(false)
  verifiedAt      DateTime?

  userId          Int?
  organizationId  Int?

  user         User?        @relation(fields: [userId], references: [id])
  organization Organization? @relation(fields: [organizationId], references: [id])

  @@index([userId])
  @@index([organizationId])
}

enum EmailType {
  PERSONAL
  WORK
  BILLING
}
```

---

### Activity_Log

Log de auditoría para todas las acciones del sistema.

```prisma
model Activity_Log {
  id       Int    @id @default(autoincrement())
  userId   Int
  orgId    Int
  action   String @db.VarChar(100) // "login", "complete_experience", "create_group"
  entity   String? @db.VarChar(50) // "Group", "Experience", "User"
  entityId Int?

  metadata Json?
  ipAddress String? @db.VarChar(45)

  createdAt DateTime @default(now())

  user User        @relation(fields: [userId], references: [id])
  org  Organization @relation(fields: [orgId], references: [id])

  @@index([userId])
  @@index([orgId])
  @@index([action])
  @@index([createdAt])
}
```

---

## Integración Better Auth

### Schema de Better Auth

Better Auth crea sus propias tablas. En Prisma 7, se generan en `generated/prisma` pero **no las modificamos manualmente**. Las extensiones se hacen via `additionalFields` en la configuración.

### Tablas que crea Better Auth

```
user          → Base auth (email, name, image, createdAt, updatedAt)
session       → Sesiones activas (token, expiresAt, ipAddress, userAgent)
account       → OAuth providers (providerId, accessToken, refreshToken)
verification  → Email verification, password reset
```

### Instanciación de Prisma Client con Neon

```typescript
// lib/prisma.ts
import 'dotenv/config'
import { PrismaClient } from './generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

export const prisma = new PrismaClient({ adapter })
```

### Configuración de Better Auth

```typescript
// auth.ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from '@better-auth/prisma-adapter'
import { prisma } from './lib/prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: await generateAppleClientSecret(...),
    },
  },

  user: {
    additionalFields: {
      orgId: { type: 'number' },
      roleId: { type: 'number' },
      username: { type: 'string' },
      documentType: { type: 'string' },
      documentNumber: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      preferredLanguage: { type: 'string' },
    },
  },
})
```

### Commands para generar schema

```bash
# Generar tablas de Better Auth en el schema
npx auth generate --config src/auth.ts

# Luego correr migrate
npx prisma migrate dev
```

### No usar organization plugin de Better Auth

Nuestro `Organization` tiene campos custom (RUC, country, etc.) que Better Auth no soporta. Mejor mantener nuestras propias tablas y managear la relación user↔org via `User.orgId`.

### Auth flow

```
1. User registra/login (Better Auth) → se crea user en "user" table
2. Frontend/XR envía Bearer token en cada request
3. Better Auth valida session token
4. NestJS guard extrae userId + orgId del session
5. RBAC check contra Role_Permission
```

---

## Configuración de Neon PostgreSQL

### Connection strings

```env
# Pooled connection — para runtime de la aplicación (con -pooler suffix)
DATABASE_URL="postgresql://user:password@endpoint-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require"

# Direct connection — para Prisma CLI (migrations, generate)
DIRECT_URL="postgresql://user:password@endpoint.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

### prisma.config.ts

```typescript
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DIRECT_URL'], // CLI usa direct connection
  },
})
```

### ¿Por qué dos connection strings?

Neon utiliza connection pooling para manejar el alto volumen de conexiones cortas típicas de serverless:

- **Pooled (-pooler)**: Para la aplicación (maneja muchas conexiones efímeras)
- **Direct**: Para Prisma CLI (migrations requieren conexión persistente)

---

## Notas sobre Prisma 7

### Cambios importantes vs Prisma 5

1. **Generador:** `"prisma-client"` (no `"prisma-client-js"`)

   ```prisma
   generator client {
     provider = "prisma-client"
     output   = "../generated/prisma"
   }
   ```

2. **Generated client:** va a `generated/prisma` (fuera de `node_modules`)

3. **Importación:**
   ```typescript
   import { PrismaClient } from '@/generated/prisma/client'
   // NO usar @prisma/client
   ```

4. **Datasource:** La URL va en `prisma.config.ts`, no en `schema.prisma`

5. **Adapter:** Para Neon, usar `PrismaNeon` de `@prisma/adapter-neon`

   ```typescript
   const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
   const prisma = new PrismaClient({ adapter })
   ```

6. **Enum sintaxis:** `@db.VarChar` para strings, enums nativos de PostgreSQL

7. **No engine property:** En Prisma 7, el `engine` property fue removido de prisma.config.ts

### Recomendaciones

- Usar Zod v4 para validación en controllers (no class-validator)
- Prisma 7 tiene mejor soporte para raw queries si necesitás performance
- Para queries complejas de negocio, considerar SQL views o stored procedures

---

## Índices sugeridos

```prisma
// Organization
@@index([slug])
@@index([status])

// User
@@index([orgId])
@@index([username])
@@index([documentType, documentNumber])
@@index([status])

// Role
@@index([code])

// Permission
@@index([module, action])
@@index([code])

// Department
@@index([orgId])
@@index([status])

// Specialty
@@index([departmentId])
@@index([status])

// Course
@@index([specialtyId])
@@index([status])

// Experience
@@index([courseId])
@@index([order])
@@index([status])

// Group
@@index([orgId])
@@index([courseId])
@@index([status])

// Activity_Log
@@index([userId])
@@index([orgId])
@@index([action])
@@index([createdAt])
```

---

## Seed de roles inicial

```sql
INSERT INTO "Role" (name, code, description) VALUES
  ('Super Administrador', 'super_admin', 'Puede crear organizaciones y admins de org'),
  ('Administrador de Org', 'org_admin', 'Gestiona su organización completa'),
  ('Instructor', 'instructor', 'Gestiona alumnos asignados a sus cursos'),
  ('Estudiante', 'student', 'Participa en experiencias y ve resultados');
```