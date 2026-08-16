# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Todo REST API — Express 5 + TypeScript on Node >= 24, CommonJS output. Storage is a
module-level in-memory array (`src/services/task.service.ts`); there is no database, so all
data is lost on restart.

## Commands

```bash
cp .env.example .env      # required once — `npm run dev` uses --env-file=.env and fails without it
npm run dev               # tsx watch on src/index.ts
npm run build             # clean + tsc -p tsconfig.build.json  → dist/
npm start                 # run the built dist/index.js
npm run typecheck         # tsc --noEmit
npm run check:fix         # biome lint + format, writing fixes (the usual pre-commit step)
npm test                  # node --test --experimental-strip-types "src/**/*.test.ts"
npm run ci                # biome ci + typecheck + test — run this before declaring work done
```

Single test file / single test case:

```bash
node --test --experimental-strip-types src/services/task.service.test.ts
node --test --experimental-strip-types --test-name-pattern="creates a task" src/**/*.test.ts
```

No test files exist yet. Tests are colocated as `*.test.ts` next to the source file
(`tsconfig.build.json` excludes them from the build) and must use `node:test` + `node:assert/strict`.
Biome enforces `test(...)` over `it(...)`, hooks at the top of the block, and no `.skip`/`.only`.

## Architecture

Request flow: `routes → validate middleware → controller → service`, with errors funneled to a
single handler.

- `src/index.ts` — listens; registers SIGINT/SIGTERM shutdown so tsx restarts don't hold the port.
- `src/app.ts` — `createApp()` builds the Express app without listening, so tests can import it
  directly. `notFoundHandler` and `errorHandler` are registered last, in that order.
- `src/config/env.ts` — the **only** module allowed to read `process.env` (Biome's `noProcessEnv`
  is disabled only here). It validates and freezes `{ nodeEnv, port, isProduction, isTest }` at
  import time and throws on bad values.

### Errors

`AppError` (`src/errors/app-error.ts`) is the only error type that produces a client-facing
response. Anything else becomes `500 INTERNAL_SERVER_ERROR / "Something went wrong"` and gets
logged. Response shape is `{ error: { code, message, details?, stack? } }`; `stack` is included
whenever `NODE_ENV !== "production"`.

Controllers `throw` **synchronously** — Express 5 catches thrown and rejected errors from
handlers, so no `try/catch` or `next(err)` wrapper is needed. Services never throw: they return
`null`/`false` for "not found" and the controller converts that into `AppError.notFound`.

### Validation

`validate(schema, source)` (`src/middlewares/validate.ts`) runs a Zod schema against
`req.body | req.params | req.query` and reports failures as
`AppError.badRequest("Validation failed", [{ path, message }])`. For `body` it reassigns
`req.body` with the parsed (trimmed, defaulted) data; for `params`/`query` it must use
`Object.assign` because those objects are getters in Express 5 — don't "simplify" that branch.

Routes compose validators in order, e.g. PATCH runs the id-param schema and then the body schema
(`src/routes/task.routes.ts`). Schemas live in `src/schemas/`, hand-written DTO/domain types in
`src/types/` — keep the two in sync manually.

### Layer boundaries

Biome `overrides` in `biome.json` enforce the dependency direction with `noRestrictedImports`;
violating them is a lint error, not a style suggestion:

- `src/config/**` and `src/types/**` are the bottom layers — they may not import routes,
  controllers or middlewares (and `types` may not import `config` either).
- `src/middlewares/**` may not import routes or controllers.
- `src/controllers/**` may not import routes.

## Conventions

Biome (2.5.8) is the single source of truth for lint and format — there is no ESLint/Prettier.
Notable enforced rules beyond the recommended presets:

- Filenames are strict `kebab-case`; `console` is limited to `error`/`warn`/`info`
  (`src/index.ts` is exempt).
- `noExplicitAny`, `noNonNullAssertion`, `noTsIgnore`, `useNullishCoalescing`,
  `useThrowOnlyError`, `noFloatingPromises`, `noImportCycles` are all errors.
- `noBarrelFile` / `noReExportAll` are errors outside `src/types/**` — don't add `index.ts`
  re-export files.
- Node builtins must use the `node:` protocol, including `node:process` (`noProcessGlobal`).
- TypeScript is strict with `noUncheckedIndexedAccess`, so array indexing yields `T | undefined`
  and needs an explicit guard (see the `current === undefined` check in `task.service.ts`).
