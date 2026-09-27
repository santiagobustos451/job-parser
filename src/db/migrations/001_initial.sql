CREATE TABLE IF NOT EXISTS jobs (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Source identity (composite unique key)
    source          TEXT NOT NULL,
    source_id       TEXT,

    -- Job details
    title           TEXT NOT NULL,
    company         TEXT,
    location        TEXT,
    url             TEXT NOT NULL,
    direct_url      TEXT,
    date_posted     TEXT,
    description     TEXT NOT NULL,
    is_remote       INTEGER,
    salary_min      INTEGER,
    salary_max      INTEGER,
    salary_currency TEXT,
    salary_interval TEXT,

    -- Persistence metadata
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_jobs_source_source_id
    ON jobs (source, source_id);
