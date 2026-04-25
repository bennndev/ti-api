# ti-api

NestJS v11 + TypeScript + Prisma + PostgreSQL + Better Auth.

## Dev commands

```bash
npm run build        # compile dist/
npm run start:dev    # watch mode
npm run start:prod  # node dist/main
npm run lint         # eslint --fix
npm run format      # prettier --write
npm run test        # jest (src only)
npm run test:e2e    # jest e2e (test/)
```

## Prisma

- Schema: `prisma/schema.prisma`
- Config: `prisma.config.ts` (uses `dotenv/config`, reads `DATABASE_URL` from env)
- Generated client lives in `generated/prisma` (not in `node_modules`)
- Run migrations: `npx prisma migrate dev` (or `prisma.config.ts` wrapper)
- After generating, rebuild: `npm run build`

## Environment

Required env vars (see `.env.example`):
- `DATABASE_URL` — PostgreSQL connection string for Prisma
- `BETTER_AUTH_URL` — Base URL for Better Auth (e.g., http://localhost:3000)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth
- `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` — Apple OAuth

Env is loaded via `dotenv/config` in `prisma.config.ts` and likely `main.ts`.

## Architecture

- Entry: `src/main.ts` — listens on `PORT ?? 3000`
- Root module: `src/app.module.ts`
- Single controller/service scaffold — replace as needed
- `test/app.e2e-spec.ts` — placeholder e2e test

## Key conventions

- ESLint flat config in `eslint.config.mjs`; prettier enforced as error
- `deleteOutDir: true` in `nest-cli.json` — dist/ cleared on build
- Prisma generator output is `../generated/prisma` (outside `src/`)
