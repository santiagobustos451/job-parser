import 'dotenv/config';
import AnalyzeJob from './tasks/analyze-job';
import GetJobs from './jobs/jobspy';

async function main() {
  const response = await AnalyzeJob();
  const jobs = await GetJobs();

  console.log(jobs);
}

main().catch(console.error);
