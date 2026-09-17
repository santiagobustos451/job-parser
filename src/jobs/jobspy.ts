import { scrapeJobs } from 'ts-jobspy';
import { Job } from './types';
import { Job as JobspyJob } from 'ts-jobspy';
import { SearchPlan } from '../types/search-plan';

export default async function GetJobs(target: SearchPlan): Promise<Job[]> {
  const result = await scrapeJobs({
    sites: ['indeed', 'linkedin'], // default: the currently working sites
    searchTerm: 'architect',
    location: 'San Francisco, CA',
    resultsWanted: 20,
    hoursOld: 72,
    country: 'usa',
    dedupe: 'content', // drop the same posting syndicated across boards
    // linkedin: { fetchDescription: true }, // richer LinkedIn data (slower)
  });

  const jobs: Job[] = result.jobs.map(mapJob);

  return jobs;
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
