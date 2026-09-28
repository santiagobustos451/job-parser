import Database from 'better-sqlite3';
import { Job } from '../jobs/types';
import { JobToJobInsert } from './helpers';

const DB_PATH = 'data/jobs.db';

// --- Types ---

export type DbJob = {
  id: number;
  source: string;
  sourceId: string | null;
  title: string;
  company: string | null;
  location: string | null;
  url: string;
  directUrl: string | null;
  datePosted: string | null;
  description: string;
  isRemote: boolean | null;
  createdAt: string;
};

export type JobInsert = {
  source: string;
  sourceId: string | null;
  title: string;
  company: string | null;
  location: string | null;
  url: string;
  directUrl: string | null;
  datePosted: string | null;
  description: string;
  isRemote: boolean | null;
};

export type JobInsertResult = {
  jobId: number;
  isNew: boolean;
};

// --- Client ---

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
  }
  return _db;
}

/**
 * Upsert a job by (source, sourceId) unique key.
 * Returns the job ID and whether it was newly inserted.
 */
export function insertJob(job: Job): JobInsertResult {
  const db = getDb();
  const jobInsert = JobToJobInsert(job);

  // First check if the job already exists
  const existing = db
    .prepare(
      'SELECT id FROM jobs WHERE source = ? AND source_id = ? LIMIT 1',
    )
    .get(jobInsert.source, jobInsert.sourceId) as { id: number } | undefined;

  if (existing) {
    return { jobId: existing.id, isNew: false };
  }

  // Insert the new job
  const stmt = db.prepare(`
    INSERT INTO jobs (
      source, source_id, title, company, location,
      url, direct_url, date_posted, description,
      is_remote
    ) VALUES (
      @source, @sourceId, @title, @company, @location,
      @url, @directUrl, @datePosted, @description,
      @isRemote
    )
    RETURNING id
  `);

  const result = stmt.get({
    source: job.source,
    sourceId: job.sourceId,
    title: job.title,
    company: job.company,
    location: job.location,
    url: job.url,
    directUrl: job.directUrl,
    datePosted: job.datePosted,
    description: job.description,
    isRemote: job.isRemote ? 1 : 0,
  }) as { id: number };

  return { jobId: result.id, isNew: true };
}

/**
 * Check if a job with the given source and sourceId already exists.
 */
export function jobExists(source: string, sourceId: string | null): boolean {
  const db = getDb();
  const row = db
    .prepare(
      'SELECT 1 FROM jobs WHERE source = ? AND source_id = ? LIMIT 1',
    )
    .get(source, sourceId) as { id: number } | undefined;

  return row !== undefined;
}

/**
 * Retrieve all stored jobs.
 */
export function getJobs(): DbJob[] {
  const db = getDb();
  return db
    .prepare(`
      SELECT
        id,
        source, source_id as sourceId,
        title, company, location,
        url, direct_url as directUrl,
        date_posted as datePosted, description,
        is_remote as isRemote,
        salary_min as salaryMin, salary_max as salaryMax,
        salary_currency as salaryCurrency, salary_interval as salaryInterval,
        created_at as createdAt
      FROM jobs
      ORDER BY id ASC
    `)
    .all() as DbJob[];
}

/**
 * Close the database connection.
 */
export function close(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}
