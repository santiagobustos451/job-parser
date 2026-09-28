import { Job } from "../jobs/types";
import { JobInsert } from "./client";

export function JobToJobInsert(job: Job): JobInsert {
  return {
    source: job.source,
    sourceId: job.sourceId,
    title: job.title,
    company: job.company,
    location: job.location,
    url: job.url,
    directUrl: job.directUrl,
    datePosted: job.datePosted,
    description: job.description,
    isRemote: job.isRemote,
  };
}