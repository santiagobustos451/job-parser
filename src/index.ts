import 'dotenv/config';

import { OpenAICompatibleProvider } from './llm/openai';
import { analyzeJob } from './tasks/analyze-job';

async function main() {
  const llmProvider = new OpenAICompatibleProvider();
  const response = await analyzeJob(llmProvider);
  console.log(response);
}

main().catch(console.error);
