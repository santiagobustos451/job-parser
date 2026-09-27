import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { readdir, readFile } from 'fs/promises';
import { dirname, join } from 'path';

const MIGRATIONS_DIR = join(__dirname, 'migrations');
const MIGRATION_TABLE = 'schema_migrations';

/**
 * Run pending migrations against the given database path.
 * Returns the number of migrations applied.
 */
export async function runMigrations(dbPath: string): Promise<number> {
  // Ensure the directory exists
  const dbDir = dirname(dbPath);
  mkdirSync(dbDir, { recursive: true });

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  try {
    // Create migration tracking table
    db.exec(`
      CREATE TABLE IF NOT EXISTS ${MIGRATION_TABLE} (
        filename TEXT PRIMARY KEY,
        applied_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Discover migration files
    const migrationFiles = await discoverMigrations(MIGRATIONS_DIR);
    const applied = await getAppliedMigrations(db);

    let appliedCount = 0;

    for (const file of migrationFiles) {
      if (applied.has(file)) {
        continue;
      }

      const sql = await readFile(join(MIGRATIONS_DIR, file), 'utf-8');
      console.log(`Applying migration: ${file}`);
      db.exec(sql);

      db.prepare(`INSERT INTO ${MIGRATION_TABLE} (filename) VALUES (?)`)
        .run(file);
      appliedCount++;
    }

    console.log(`Migrations complete: ${appliedCount} applied`);
    return appliedCount;
  } finally {
    db.close();
  }
}

async function discoverMigrations(dir: string): Promise<string[]> {
  const entries = await readdir(dir);
  return entries
    .filter((f) => f.endsWith('.sql'))
    .sort();
}

async function getAppliedMigrations(
  db: Database.Database,
): Promise<Set<string>> {
  const rows = db.prepare(`SELECT filename FROM ${MIGRATION_TABLE}`).all() as {
    filename: string;
  }[];
  return new Set(rows.map((r) => r.filename));
}

// CLI entry point
const DB_PATH = 'data/jobs.db';
runMigrations(DB_PATH).catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
