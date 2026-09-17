# Job Application Automation — Development Plan

## Goal

Build a personal job-search pipeline that:

1. Searches multiple job sources.
2. Normalizes and deduplicates listings.
3. Applies cheap deterministic filtering and preliminary matching.
4. Uses an LLM only on a small shortlist of promising jobs.
5. Produces useful application outputs such as a tailored resume and cover letter.
6. Automates safe application steps where practical and creates notifications/actions for anything that still needs human involvement.

The system should minimize unnecessary LLM usage. The LLM is the expensive final reasoning/generation layer, not the scraper/filter engine.

---

## Core Source of Truth

### Master Profile

The master profile represents factual, reusable information about the candidate.

It answers:

> What can we truthfully say about this person?

It contains things such as:

- identity/contact information
- work experience
- projects
- education
- skills
- languages

The master profile is not tailored to a particular job and should remain the canonical source of truth.

Generated resumes and application documents must not become new sources of truth.

---

## Job Pipeline

```text
Master Profile
      |
      v
Target Profiles / Job Targets
      |
      v
Search Queries
      |
      v
Job Sources (JobSpy + custom sources)
      |
      v
Raw Job Results
      |
      v
Normalize -> internal Job type
      |
      v
Hard Filtering
      |
      v
Deduplication
      |
      v
Preliminary Matching
      |
      v
Shortlist
      |
      v
LLM Analysis / Prioritization
      |
      +----------------------+
      |                      |
      v                      v
Tailored Resume        Cover Letter
      |
      v
Application Actions / Notifications
```

---

## Architecture Principles

### 1. External data gets normalized at the boundary

JobSpy and future scrapers should produce external/source-specific data. The application converts that into its own internal `Job` model.

Downstream code should depend on the internal model, not JobSpy's data structure.

### 2. Acquisition, filtering, reasoning, and generation are separate

- Acquisition finds jobs.
- Filtering removes jobs that clearly do not belong.
- Preliminary matching cheaply estimates relevance.
- The LLM performs expensive contextual reasoning.
- Generation creates application materials.

### 3. Prefer deterministic work where deterministic work is sufficient

Do not spend tokens asking an LLM to perform tasks that can be handled reliably with ordinary code.

### 4. Do not prematurely abstract

Introduce abstractions when a real repeated concept or boundary exists. Avoid building a generic framework before the actual requirements are known.

### 5. Preserve source data when useful

The normalized `Job` model should contain what the application needs, but keeping access to the raw source result during development may be useful when new fields become relevant.

---

## Current Project Structure

```text
src/
├── data/
│   └── profile.ts
├── jobs/
│   ├── jobspy.ts
│   └── types.ts
├── tasks/
│   └── analyze-job.ts
├── llm/
│   ├── provider.ts
│   └── openai.ts
├── types/
│   └── profile.ts
└── index.ts
```

### Existing components

- `data/profile.ts` — candidate master profile data.
- `types/profile.ts` — profile types.
- `llm/provider.ts` — application-level LLM interface and response types.
- `llm/openai.ts` — OpenAI-compatible provider implementation.
- `tasks/analyze-job.ts` — first experimental LLM task.
- `jobs/jobspy.ts` — JobSpy adapter/fetcher.
- `jobs/types.ts` — internal job model.

---

## LLM Layer

The application should talk to an application-level `LLMProvider` abstraction rather than directly to the OpenAI SDK from individual tasks.

Current conceptual boundary:

```text
Task
  |
  v
LLMProvider
  |
  v
OpenAICompatibleProvider
  |
  v
OpenAI-compatible API
```

The provider is responsible for API-specific mechanics and translating provider responses into the application's `LLMResponse` type.

Tasks are responsible for prompt/task logic.

---

## Job Acquisition

### JobSpy

`ts-jobspy` is currently installed and working.

JobSpy provides a rich source-specific job record including fields such as:

- source/site
- source ID
- title
- company
- location
- URLs
- posting date
- remote status
- salary fields
- description
- various company metadata

The application should not make JobSpy's full object its internal domain model.

### Custom Sources

Future job sources should be treated as additional adapters that ultimately produce the application's internal `Job` type.

Conceptually:

```text
JobSource
  ├── JobSpy
  ├── Custom source A
  ├── Custom source B
  └── ...
```

Do not modify/fork JobSpy unless there is a concrete reason to do so.

---

## Internal Job Model

The first-pass internal model is intentionally small and based on the actual JobSpy output.

Conceptually:

```ts
type Job = {
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

  salary: {
    min: number | null;
    max: number | null;
    currency: string | null;
    interval: string | null;
  };
};
```

This model should remain conservative. Do not parse the description into sophisticated semantic fields unless there is a concrete downstream need.

---

## Target Profiles / Job Targets

### Purpose

The master profile describes the candidate.

A `TargetProfile` describes the kind of work we are currently trying to find.

This is necessary because the candidate has multiple plausible job directions rather than one universal search identity.

Examples might eventually include:

- Frontend Developer
- Full Stack Developer
- PHP/Symfony Developer
- Technical Support
- Unity Developer
- Other target roles

A target profile can be derived from the master profile, but it is not a replacement for it and must not contain invented candidate facts.

### Important distinction

A target profile should separate:

1. **Retrieval** — what terms/queries should we search for?
2. **Filtering** — what should definitely be excluded?
3. **Matching** — what signals indicate relevance?

These should not be collapsed into a single keyword list.

### Current design direction

A first-pass target profile may contain concepts like:

```ts
type TargetProfile = {
  name: string;

  searchTerms: string[];
  requiredKeywords?: string[];
  preferredKeywords?: string[];
  excludedKeywords?: string[];

  locations?: string[];
  remoteOnly?: boolean;
};
```

This is a design draft, not a finalized contract.

The next design task is to decide the minimum information a target profile needs to:

- generate search queries
- apply cheap filters
- perform preliminary matching

---

## Filtering and Matching Strategy

### Hard Filtering

Use deterministic rules for conditions that clearly eliminate a job, such as:

- impossible location constraints
- already-seen/already-applied jobs
- obvious spam or invalid listings
- explicit requirements that make a listing clearly impossible

Avoid overly aggressive keyword exclusion.

### Deduplication

JobSpy can perform source-level/content deduplication, but this is not the application's final dedupe layer.

Our own deduplication must eventually work across all job sources.

The same real-world job can appear at multiple URLs, sources, or with different source IDs.

### Preliminary Matching

This should be cheap and deterministic enough to reduce the number of jobs sent to the LLM.

It can use signals such as:

- title relevance
- keyword presence
- target-profile matches
- location compatibility
- exclusions

The preliminary score is only a routing/filtering mechanism, not the final decision about whether an application is worthwhile.

---

## LLM Role

The LLM should operate on a relatively small shortlist, ideally around the daily volume we actually want to review.

Its eventual responsibilities include:

1. Assessing compatibility between the master profile and shortlisted jobs.
2. Summarizing or prioritizing the shortlist.
3. Selecting relevant evidence from the master profile.
4. Producing tailored application materials for jobs worth pursuing.
5. Identifying actions that should be automated versus actions that require human involvement.

For example:

```text
500 scraped jobs
      |
      v
cheap filtering / dedupe / preliminary matching
      |
      v
~10 shortlisted jobs
      |
      v
LLM analysis and prioritization
      |
      v
~1-3 application candidates
      |
      v
Tailored resume + cover letter + application actions
```

The exact numbers are not fixed; this is the intended architecture.

---

## Application Actions

The eventual system should not assume every application is an email.

Some actions can be automated; others should create a human action/notification.

Examples:

- generate and prepare an email
- submit something automatically where safe and appropriate
- open a LinkedIn profile and tell the user to send a message
- remind the user to complete a manual application

The system should represent these as application actions rather than forcing everything through a single delivery mechanism.

---

## Development Sequence

### Phase 1 — Foundation (current)

- [x] TypeScript project setup
- [x] Master profile data/types
- [x] LLM provider abstraction
- [x] OpenAI-compatible provider
- [x] Basic LLM task experiment
- [x] Install and test `ts-jobspy`
- [x] Inspect real JobSpy results
- [x] Create initial internal `Job` model
- [x] Normalize JobSpy output into `Job`

### Phase 2 — Search Model

- [ ] Design `TargetProfile`
- [ ] Decide how target profiles produce search queries
- [ ] Define search configuration/criteria
- [ ] Support multiple searches per target
- [ ] Combine results from searches

### Phase 3 — Job Processing

- [ ] Implement hard filters
- [ ] Implement cross-source deduplication
- [ ] Implement preliminary relevance matching
- [ ] Persist/track seen and processed jobs
- [ ] Produce a shortlist suitable for LLM processing

### Phase 4 — LLM Triage

- [ ] Design the LLM's job-compatibility analysis
- [ ] Analyze a small daily batch of shortlisted jobs
- [ ] Compare/prioritize results
- [ ] Decide which jobs should proceed to application generation

### Phase 5 — Application Generation

- [ ] Select relevant evidence from master profile
- [ ] Tailor resume content
- [ ] Generate cover letters
- [ ] Generate final document artifacts (e.g. DOCX)

### Phase 6 — Application Workflow

- [ ] Represent application actions
- [ ] Automate safe/reliable delivery steps
- [ ] Generate human-action notifications
- [ ] Track application state

### Phase 7 — Hardening / Automation

- [ ] Scheduled searches
- [ ] Source health monitoring
- [ ] Logging and error handling
- [ ] Usage/cost tracking
- [ ] Better deduplication
- [ ] Prompt/version tracking
- [ ] Persistence and reporting

---

## Immediate Next Step

Design `TargetProfile`.

Question to answer:

> What is the minimum information needed to describe a type of job we want, generate useful search queries, apply cheap filters, and perform preliminary matching?

Do not build the full search/filter framework until this model is clear.
