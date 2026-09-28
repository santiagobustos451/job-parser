# AGENTS.md

Personal job-search pipeline in TypeScript. Scrapes LinkedIn + Indeed (ts-jobspy), stores jobs in SQLite, uses an OpenAI-compatible LLM for analysis.
Status: experiment. Phases 1-2 work. Phases 3-7 (filtering, matching, LLM analysis, application generation, scheduling) are NOT built.

## Rules that matter most (read first)

1. Read a file before you edit it. Never edit from memory.
2. Make the smallest change that does the task. One task per session. No drive-by refactors.
3. After every code change, run `npm run check`. Fix all errors before you say you are done.
4. Do not invent APIs, columns, env vars, or files. If unsure, open the file or run `grep -rn "<name>" src/`.
5. If the same command fails twice with the same error, STOP. Report the error and what you tried. Do not loop.
6. Never touch anything under "Never" below.

## Stack

- TypeScript, strict, ES2022, NodeNext modules. No build step: files run directly with `tsx`.
- Runtime deps: `better-sqlite3`, `dotenv`, `openai` (v7), `ts-jobspy` (v3).
- Dev deps: `typescript`, `tsx`, `prettier`.
- No tests. No ESLint. Only Prettier.

## Commands

```bash
npm install                                           # install deps
npm run check                                         # type check (tsc --noEmit). Run after every change.
npm run format                                        # prettier write
npm run format:check                                  # prettier check only
npm run db:migrate                                    # apply pending SQL migrations to data/jobs.db
npm run generate:search-plan -- --mode llm            # write src/data/generated/search-plans-llm.json
npm run generate:search-plan -- --mode basic          # write search-plans-basic.json
npm run generate:search-plan -- --mode llm --target "Web Developer"   # one target, by NAME
npm run search                                        # scrape using search-plans-llm.json, insert into DB
npm run search -- --target full-stack-developer       # one target, by ID
npm run dev                                           # runs src/index.ts (placeholder task)
```

- `npm run search` hits the network and writes to the real DB. Only run it when the task asks for it.
- To check one file quickly: `npx tsx path/to/file.ts`.
- For long output, cut it: `npm run check 2>&1 | head -40`. Do not paste huge logs into the chat.

## Layout

```
src/index.ts              entry point (runs placeholder analyzeJob)
src/types/                MasterProfile, TargetProfile, SearchPlan types
src/data/                 static data: master-profile.ts, target-profiles.ts
src/data/generated/       GENERATED json (search plans). Do not hand-edit.
src/llm/provider.ts       LLMProvider interface: complete(messages)
src/llm/openai.ts         OpenAICompatibleProvider (Groq now; any OpenAI-compatible URL works)
src/jobs/types.ts         internal Job type
src/jobs/jobspy.ts        ONLY file allowed to import ts-jobspy. fetchJobs() + mapJob()
src/tasks/                LLM tasks: generate-search-plan.ts (real), analyze-job.ts (placeholder)
src/db/client.ts          SQLite singleton: insertJob, jobExists, getJobs, close
src/db/helpers.ts         Job -> JobInsert conversion
src/db/migrate.ts         migration runner
src/db/migrations/        numbered .sql files
src/cli/                  CLI entry points + lib/helpers.ts (getArg)
data/jobs.db              real scraped jobs (423 rows). Operational state.
```

Data flow: target profiles -> search plan JSON -> `cli/search.ts` -> `fetchJobs()` -> `mapJob()` -> `insertJob()` -> SQLite.

## Architecture boundaries (do not break)

- All LLM calls go through `LLMProvider.complete()`. Never import `openai` in a task file.
- ts-jobspy types stay inside `src/jobs/jobspy.ts`. Everything else uses the internal `Job` type.
- One SQLite connection: use `getDb()` in `src/db/client.ts`. Never open a second one.
- Deterministic code first. Use the LLM only for judgment that plain code cannot do.
- Generated artifacts are JSON in `src/data/generated/`. Job state lives in SQLite.

## Code style

- Copy the style of the neighboring file: imports, quotes, semicolons. Run `npm run format` when done.
- Types/classes PascalCase. Functions/variables camelCase. Files kebab-case (`generate-search-plan.ts`). CLI flags kebab-case (`--search-plans`).
- Use `import type { ... }` for type-only imports.
- Relative imports only. No barrel `index.ts` files.
- All I/O is async/await. No callbacks.
- SQL: prepared statements with parameters only. Never build SQL with string concatenation.
- CLI scripts: `import 'dotenv/config'` first, `main().catch(...)` that calls `process.exit(1)`.
- Validation throws an `Error` with a clear message. Do not swallow errors silently.
- Do not add dependencies without asking.

## Database changes

- Schema changes = a NEW file in `src/db/migrations/`, named with the next number (`002_<what>.sql`). Then `npm run db:migrate`.
- Never edit an existing migration. Migrations are not reversible.
- Before any migration or bulk write, back up: `cp data/jobs.db data/jobs.db.bak`.
- Jobs are unique by `(source, source_id)`. Existing rows are ignored, not updated.

## Known problems (do not "discover" them again)

- `getJobs()` in `src/db/client.ts` selects salary columns that do not exist in the schema. It crashes if called. Fix it (remove the columns, or add a migration for them) BEFORE using it anywhere.
- Salary is mapped in `mapJob()` but never saved to the DB.
- `cli/search.ts` has stale `// TODO` comments. The code under them is already implemented.
- `search-plans-basic.json` is stale. Its targets do not match current target profiles.
- `analyze-job.ts` is a throwaway test prompt with an inappropriate joke. Replace it when you build the real analysis. Never copy its tone or wording.
- The master profile is loaded but not used by any pipeline step yet.
- `cli/search.ts` calls `JSON.parse()` on the plans file with no validation.

## Ask first

Stop and ask the user before you:

- add a dependency, or change `tsconfig.json`, `package.json` scripts, or Prettier config
- change the DB schema or add a migration
- run `npm run search` (network + DB writes) or any command that calls the LLM API
- start a new pipeline phase (filtering, matching, LLM analysis, resumes, scheduling)
- delete or rename any file

## Never

- Never edit or delete `data/jobs.db`, `data/jobs.db-wal`, or `data/jobs.db-shm` by hand.
- Never edit existing files in `src/db/migrations/`.
- Never hand-edit `src/data/generated/*.json`. Regenerate with the CLI.
- Never read, print, or commit `.env`. It holds `LLM_API_KEY`. Do not hard-code keys, URLs, or model names.
- `src/data/master-profile.ts` is real personal data. Do not copy its contents into tests, docs, commit messages, or examples. Use fake data.
- Never bypass the boundaries listed above.

## Environment

`.env` variables: `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`, `PLATFORMS` (default `linkedin,indeed`), `COUNTRY`.
Switching LLM: change only `LLM_BASE_URL` and `LLM_MODEL` (Ollama example: `http://localhost:11434/v1`).

## How to work

1. Restate the task in one sentence.
2. Find the exact files with `grep -rn` or by opening them. Read them.
3. Edit with small, exact replacements. Do not rewrite whole files.
4. Run `npm run check`, then `npm run format`.
5. Report: what changed, which files, and the result of `npm run check`. Say plainly what you did not verify.

Reminder: read before edit, smallest change, `npm run check`, stop on repeated failure, ask before schema/network/dependency changes.
