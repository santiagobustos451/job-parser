# Job Parser Experiment

## Overview

A TypeScript experiment that parses a candidate profile and uses an LLM to analyze job fit. It combines structured resume data with AI-powered job matching to evaluate alignment between a candidate's background and target roles.

## Project Structure

```
job-parser-experiment/
├── src/
│   ├── index.ts                   # Entry point — runs the analysis pipeline
│   ├── data/
│   │   └── profile.ts             # Sample candidate profile (Elena Vasquez, Senior Full-Stack Engineer)
│   ├── tasks/
│   │   └── analyze-job.ts         # Task runner — calls the LLM with the profile & job context
│   ├── llm/
│   │   ├── provider.ts            # LLM provider interface & types (Message, LLMResponse, LLMProvider)
│   │   └── openai.ts              # OpenAI-compatible LLM provider implementation
│   └── types/
│       └── profile.ts             # TypeScript types for the candidate profile structure
├── .env                           # Environment variables (LLM_API_KEY, LLM_BASE_URL, LLM_MODEL)
├── .gitignore
├── .prettierrc                    # Prettier configuration
├── .prettierignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── SUMMARY.md                     # This file
```

## How It Works

1. **Profile Data** (`src/data/profile.ts`) — A sample profile for "Elena Vasquez" containing identity, experience, education, skills, and languages.
2. **Type Definitions** (`src/types/profile.ts`) — Strongly-typed interfaces defining the profile structure.
3. **LLM Provider** (`src/llm/`) — An abstracted LLM interface with an OpenAI-compatible implementation that supports custom base URLs (useful for compatible providers like Ollama, LiteLLM, etc.).
4. **Analysis Task** (`src/tasks/analyze-job.ts`) — Orchestrates the analysis by sending the profile to the LLM with a system prompt for job-fit evaluation.

## Running the Project

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env   # if available, or edit .env directly

# Run the analysis
npm run dev

# Type-check
npm run check

# Format code
npm run format
```

## Dependencies

| Package      | Purpose                           |
|-------------|-----------------------------------|
| `openai`    | OpenAI API client for LLM calls   |
| `dotenv`    | Load environment variables        |
| `ts-jobspy` | (Installed) Job scraping utility  |

## Dev Dependencies

| Package      | Purpose                           |
|-------------|-----------------------------------|
| `typescript`| Type checking & compilation       |
| `tsx`       | Run TypeScript directly           |
| `prettier`  | Code formatting                   |
