import 'dotenv/config';
import AnalyzeJob from './tasks/analyze-job';
import GetJobs from './jobs/jobspy';
import OpenAICompatibleProvider from './llm/openai';

export const llm = new OpenAICompatibleProvider();

async function main() {
  const response = await AnalyzeJob();
}

main().catch(console.error);
