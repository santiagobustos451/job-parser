import { scrapeJobs } from 'ts-jobspy';
import type { Job as JobspyJob, SiteName } from 'ts-jobspy';
import { Job } from './types';
import { SearchPlan } from '../types/search-plan';

export type JobSpyConfig = {
  sites: SiteName[];
  resultsWanted: number;
  hoursOld: number;
  country: string;
  dedupe: 'none' | 'url' | 'content' | boolean;
};

const defaultConfig: JobSpyConfig = {
  sites: ['indeed', 'linkedin'],
  resultsWanted: 20,
  hoursOld: 72,
  country: 'usa',
  dedupe: 'content',
};

export async function fetchJobs(
  target: SearchPlan,
  config: Partial<JobSpyConfig> = {},
): Promise<Job[]> {
  const merged = { ...defaultConfig, ...config };

  const result = await scrapeJobs({
    sites: merged.sites,
    searchTerm: 'architect',
    location: 'San Francisco, CA',
    resultsWanted: merged.resultsWanted,
    hoursOld: merged.hoursOld,
    country: merged.country,
    dedupe: merged.dedupe,
  });

  return result.jobs.map(mapJob);
}

function mapJob(job: JobspyJob): Job {
  return {
    source: job.site,
    sourceId: job.id ?? null,
    title: job.title,
    company: job.company,
    location: job.location,
    url: job.jobUrl,
    directUrl: job.jobUrlDirect,
    datePosted: job.datePosted,
    description: job.description ?? '',
    isRemote: job.isRemote,
    salary: {
      min: job.minAmount,
      max: job.maxAmount,
      currency: job.currency,
      interval: job.interval,
    },
  };
}
