import 'dotenv/config';

import { fetchJobs } from '../jobs/jobspy';
import { getArg } from './lib/helpers';
import { readFileSync } from 'fs';
import { Job } from '../jobs/types';
import { SearchPlan } from '../types/search-plan';
import { insertJob } from '../db/client';
// TODO: import database client

async function main() {
  // TODO: Parse CLI arguments
  // e.g. --target fullstack
  const targetId = getArg('--target');
  const searchPlansPath = getArg('--search-plans') ?? 'src/data/generated/search-plans-llm.json';

  // Load the generated search plan(s)
  const searchPlansData = JSON.parse(readFileSync(searchPlansPath, 'utf-8'));

  // Filter plans by targetId if provided
  const searchPlans = targetId
    ? searchPlansData.filter((plan: SearchPlan) => plan.target === targetId)
    : searchPlansData;

    if (searchPlans.length === 0) {
      console.error(`No search plans found.`);
      process.exit(1);
    }

  console.log(`Loaded ${searchPlans.length} search plan(s) from ${searchPlansPath}`);

  // TODO: Fetch jobs using the selected search plan
  //const jobs = await fetchJobs(/* TODO: search plan */);
  const jobs: Job[] = [];

  for(const plan of searchPlans) {
    console.log(`Fetching jobs for target: ${plan.target}`);
    const fetchedJobs = await fetchJobs(plan);
    jobs.push(...fetchedJobs);
  }

  console.log(`Fetched ${jobs.length} jobs in total.`);

  const insertedJobs: { jobId: number; isNew: boolean }[] = [];
  const existingJobs: { jobId: number; isNew: boolean }[] = [];
  const failedJobs: { job: Job; error: any }[] = [];

  // TODO: Store jobs in SQLite
  for(const job of jobs) {
    const result = insertJob(job);
    if (result.isNew) {
      insertedJobs.push(result);
    } else {
      existingJobs.push(result);
    }
  }

  // TODO: Print a useful summary
  console.log(`Successfully stored ${jobs.length} jobs.`);
  console.log(`Inserted ${insertedJobs.length} new jobs.`);
  console.log(`Found ${existingJobs.length} existing jobs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});