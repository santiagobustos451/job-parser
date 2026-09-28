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
  country: 'Argentina',
  dedupe: 'content',
};

export async function fetchJobs(
  target: SearchPlan,
  config: Partial<JobSpyConfig> = {},
): Promise<Job[]> {
  const merged = { ...defaultConfig, ...config };
  const foundJobs: Job[] = [];

  for (const query of target.queries) {
    if (query.trim().length < 3) {
      throw new Error(`Query "${query}" is too short. Must be at least 3 characters.`);
    }
    for (const location of target.locations) {
      if (location.trim().length < 3) {
        throw new Error(`Location "${location}" is too short. Must be at least 3 characters.`);
      }
      const result = await scrapeJobs({
        sites: target.sources as SiteName[],
        searchTerm: query,
        location: location,
        resultsWanted: merged.resultsWanted,
        hoursOld: merged.hoursOld,
        country: merged.country,
        dedupe: merged.dedupe,
      });
      foundJobs.push(...result.jobs.map(mapJob));
    }
  }
  return foundJobs;
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
