import 'dotenv/config';

import OpenAI from 'openai';
import Profile from './types/profile';
import profile from './data/profile';

const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

async function analyzeJob(
  profile: Profile,
  job: string,
): Promise<string | null> {
  const response = await openai.chat.completions.create({
    model: process.env.LLM_MODEL ?? 'openai/gpt-oss-20b',
    messages: [
      {
        role: 'user',
        content: `Given this profile: ${JSON.stringify(profile)} give me a score out of 10 to rate how well it matches the job described here: '${job}'`,
      },
    ],
  });
  return response.choices[0]?.message?.content;
}

async function main() {
  const response = await analyzeJob(profile, 'The perfect job for her');

  console.log(response);
}

main().catch(console.error);
