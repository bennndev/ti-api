# ti-api

> API REST para plataforma de aprendizaje XR/VR con gestión organizacional.
> Stack: NestJS v11 + Prisma 7 + Neon PostgreSQL + Better Auth + Zod

---

## Stack tecnológico

| Capa | Tecnología | Propósito |
|------|------------|-----------|
| Runtime | NestJS v11 | Framework API, DI, modularización |
| ORM | Prisma 7 + `@prisma/adapter-neon` | Acceso a datos, migrations |
| Database | Neon PostgreSQL | PostgreSQL serverless con pooling |
| Auth | Better Auth + `@better-auth/prisma-adapter` | OAuth (Google, Apple), JWT, email/password |
| Validación | Zod v4 | Schemas de validación runtime (NO class-validator) |
| Docs | @nestjs/swagger | OpenAPI 3.0 / Swagger UI |
| Logging | pino + nestjs-pino | Logging estructurado JSON |

---

## Arquitectura

### Principios fundamentales

**NestJS se basa en modularización + inyección de dependencias:**

```
┌─────────────────────────────────────────────────────────────┐
│                     NestJS IoC Container                     │
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │  Module A   │───▶│  Module B   │───▶│  Module C   │      │
│  │             │    │             │    │             │      │
│  │ Controller  │    │  Service    │    │ Repository  │      │
│  │     ▼       │    │     ▼       │    │     ▼       │      │
│  │    DTO      │    │   Logic     │    │   Prisma    │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

- **Module**: Agrupa funcionalidad relacionada (controllers, services, providers, imports, exports)
- **Provider/Service**: Contiene lógica de negocio, inyectable via constructor
- **Controller**: Maneja HTTP requests, delega a services
- **Repository**: Abstrae acceso a datos (usa Prisma)
- **DTO**: Data Transfer Object con validación Zod

### Arquitectura por bounded contexts

El proyecto sigue **Domain-Driven Design** con bounded contexts bien definidos:

```
src/
├── main.ts                          # Bootstrap: Swagger, Pino, global pipes
├── app.module.ts                    # Root module, importa todos los feature modules
│
├── lib/
│   ├── prisma.ts                   # Prisma singleton con Neon adapter
│   └── auth.ts                     # Better Auth configuration
│
└── modules/
    ├── auth/                       # auth-context
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.repository.ts      # Acceso a User de Better Auth
    │   ├── dto/
    │   │   └── *.schema.ts        # Zod schemas
    │   └── auth.module.ts
    │
    ├── organization/               # organization-context
    │   ├── organization.controller.ts
    │   ├── organization.service.ts
    │   ├── organization.repository.ts
    │   ├── department/
    │   │   ├── department.service.ts
    │   │   └── department.repository.ts
    │   ├── specialty/
    │   ├── course/
    │   └── organization.module.ts
    │
    ├── learning/                   # learning-context
    │   ├── learning.controller.ts
    │   ├── learning.service.ts
    │   ├── experience/
    │   │   ├── experience.service.ts
    │   │   └── experience.repository.ts
    │   ├── group/
    │   └── learning.module.ts
    │
    ├── rbac/                      # rbac-context
    │   ├── rbac.controller.ts
    │   ├── rbac.service.ts
    │   ├── rbac.repository.ts
    │   └── rbac.module.ts
    │
    ├── contact/                   # contact-context
    │   ├── contact.controller.ts
    │   ├── contact.service.ts
    │   ├── phone/
    │   ├── email/
    │   └── contact.module.ts
    │
    └── audit/                     # audit-context
        ├── audit.controller.ts
        ├── audit.service.ts
        ├── audit.repository.ts
        └── audit.module.ts
```

### Module pattern (por cada bounded context)

```typescript
// modules/organization/organization.module.ts
@Module({
  imports: [],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationRepository],
  exports: [OrganizationService],  // Exportar si otros modules lo usan
})
export class OrganizationModule {}
```

```typescript
// modules/organization/organization.service.ts
@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly logger: Logger,
  ) {}

  async findAllByOrg(orgId: number): Promise<Organization[]> {
    return this.organizationRepository.findMany({ orgId })
  }

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    const data = createOrganizationSchema.parse(dto)
    return this.organizationRepository.create(data)
  }
}
```

```typescript
// modules/organization/organization.repository.ts
@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filter: { orgId: number }): Promise<Organization[]> {
    return this.prisma.organization.findMany({ where: filter })
  }

  async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    return this.prisma.organization.create({ data })
  }
}
```

### dependency injection (DI) en NestJS

**Reglas fundamentales:**

1. **Register** — Todo provider debe estar en el array `providers` de algún `@Module()`
2. **Inject** — Se inyecta via constructor: `constructor(private readonly svc: MyService)`
3. **Scope** — Por defecto es singleton (una instancia compartida)
4. **Module boundaries** — Un module puede importar otros via `imports[]`

```
@Module({
  imports: [OtherModule],           //other modules whose exported providers are available
  controllers: [MyController],       //handlers
  providers: [MyService],           //injectables (services, repositories, guards, etc.)
  exports: [MyService],            //make this provider available to other modules
})
```

---

## Patrón de desarrollo por recurso

Siguiendo las mejores prácticas de NestJS verificadas con Context7.

### Estructura de archivos por módulo

```
modules/
└── {resource}/
    ├── {resource}.controller.ts    # HTTP handlers, routes, Swagger docs
    ├── {resource}.service.ts        # Lógica de negocio, validación
    ├── {resource}.repository.ts     # Acceso a datos (Prisma queries)
    ├── dto/
    │   ├── create-{resource}.schema.ts  # Zod schema para creación
    │   ├── update-{resource}.schema.ts  # Zod schema para actualización
    │   └── response-{resource}.schema.ts # Zod schema para respuesta
    └── {resource}.module.ts         # Module que engloba todo
```

### Flujo de datos: Controller → Service → Repository

```
HTTP Request
     ▼
@Controller (recibe @Body, valida con Zod)
     ▼
@Service (orquesta lógica de negocio)
     ▼
@Repository (ejecuta queries contra Prisma)
     ▼
Prisma (genera SQL, ejecuta en PostgreSQL)
```

### Ejemplo: Create Resource

```typescript
// modules/auth/dto/create-user.schema.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
})

export type CreateUserDto = z.infer<typeof createUserSchema>
```

```typescript
// modules/auth/auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOkResponse({ type: UserResponseDto })
  async signUp(@Body() body: CreateUserDto) {
    // Zod validation automático via pipe (config en main.ts)
    return this.authService.signUp(body)
  }
}
```

```typescript
// modules/auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly logger: Logger,
  ) {}

  async signUp(dto: CreateUserDto) {
    const data = createUserSchema.parse(dto) // throw if invalid
    return this.authRepository.create(data)
  }
}
```

```typescript
// modules/auth/auth.repository.ts
@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data })
  }
}
```

### Validación con Zod

**Regla:** validation se hace en el Service, no en el Controller (el Controller solo delega).

```typescript
// En el service
async create(dto: CreateUserDto) {
  const data = createUserSchema.parse(dto) // Zod valida y throws ZodError si falla
  return this.repository.create(data)
}
```

**Para endpoints simples** (como auth), se puede usar el `Schema validation pipe` de NestJS con Zod. Para endpoints complejos, la validación va en el Service.

### Response DTOs y Swagger

**Crear un schema de respuesta** para que Swagger infiera los tipos correctamente:

```typescript
// dto/response-user.schema.ts
export const userResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
})

export type UserResponseDto = z.infer<typeof userResponseSchema>

// En el controller
@ApiOkResponse({ type: UserResponseDto })
```

### Integración Better Auth + NestJS

Better Auth se integra via `toNodeHandler` de `better-auth/node`:

```typescript
// main.ts
import express from 'express'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './lib/auth'

const app = express()

// Better Auth maneja /auth/* routes
app.all('/auth/*', toNodeHandler(auth))
```

Better Auth expone:
- `POST /auth/sign-up` — registro email/password
- `POST /auth/sign-in` — login email/password
- `POST /auth/sign-out` — logout
- `GET /auth/google` — redirect OAuth Google
- `GET /auth/google/callback` — callback Google
- `GET /auth/apple` — redirect OAuth Apple
- `GET /auth/apple/callback` — callback Apple

---

## Modelo de datos (bounded contexts)

### auth-context
- `User` — extiende Better Auth (`user.id` compartido)
- Tablas de Better Auth: `session`, `account`, `verification`

### organization-context
- `Organization` (tenant root — tiene `orgId` como ancla de aislamiento)
- `Department` → pertenece a Organization
- `Specialty` → pertenece a Department
- `Course` → pertenece a Specialty

### learning-context
- `Experience` — experiencia XR/VR (VR, VIDEO, DOCUMENT, SLIDES, INDUCTION)
- `Group` — grupo de estudiantes asignado a un curso
- `User_Group` — membresía N:M user↔group con rol (LEADER/MEMBER)
- `Group_Experience` — tracking de progreso (attempts, score, status)

### rbac-context
- `Role` — roles del sistema (super_admin, org_admin, instructor, student)
- `Permission` — permisos granulares (course.create, group.read, etc.)
- `Role_Permission` — relación N:M

### contact-context
- `Phone` — teléfonos (MOBILE, LANDLINE, WORK) — user u organization
- `Email` — emails (PERSONAL, WORK, BILLING) — user u organization

### audit-context
- `Activity_Log` — log de auditoría (userId, orgId, action, entity, metadata)

---

## Dev commands

```bash
npm run build        # compile dist/
npm run start:dev    # watch mode
npm run start:prod   # node dist/main
npm run lint         # eslint --fix
npm run format       # prettier --write
npm run test         # jest (src only)
npm run test:e2e     # jest e2e (test/)

# Prisma
npx prisma migrate dev           # crear migración
npx prisma generate              # generar client (luego npm run build)
npm run db:push                  # push schema sin migration (dev rápido)
```

---

## Prisma

- **Schema**: `prisma/schema.prisma`
- **Config**: `prisma.config.ts` (lee `DIRECT_URL` para CLI)
- **Generated client**: `generated/prisma` (fuera de `node_modules`)
- **Importar client**: `import { PrismaClient } from '@/generated/prisma/client'` (NO `@prisma/client`)
- **Adapter**: `PrismaNeon` de `@prisma/adapter-neon` para connection pooling

---

## Environment

Variables requeridas (ver `.env.example`):

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection pooled para runtime (`*-pooler.region.neon.tech`) |
| `DIRECT_URL` | Connection directa para Prisma CLI (`*.region.neon.tech`) |
| `BETTER_AUTH_URL` | Base URL de la API (ej: http://localhost:3000) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | OAuth Google |
| `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` | OAuth Apple |

---

## Key conventions

- **Validation**: Usar Zod v4 (NO class-validator — incompatible con Prisma 7)
- **ESLint**: Flat config en `eslint.config.mjs`; prettier enforced as error
- **Build**: `deleteOutDir: true` en `nest-cli.json` — dist/ se limpia en cada build
- **Logging**: Estructurado JSON en producción, pino-pretty en desarrollo
- **Auth flow**: Better Auth valida session → guard extrae userId + orgId → RBAC check

---

## Estructura de commits

```
feat(auth): add better auth with google and apple oauth
feat(org): implement organization and department modules
feat(learning): add experience and group management
fix(rbac): correct permission check in guard
docs(readme): update api documentation
```

---

## Notas técnicas

### Por qué Zod en vez de class-validator

Prisma 7 dejó de soportar `class-validator` en el adapter. Zod v4 ofrece:
- Runtime validation más performante
- Type inference automático
- Compatible con OpenAPI schema generation via `@nestjs/swagger`

### Por qué Repository pattern

Separa la lógica de acceso a datos de la lógica de negocio:
- `Service` → business logic, orchestration, validation
- `Repository` → Prisma queries, data mapping

Esto facilita testing (mockeas el repository) y future swaps (ej: cambiar a otra DB).

### Multi-tenant

Todas las entidades relevantes tienen `orgId` como filtro base. Queries siempre filtran por org para aislamiento.