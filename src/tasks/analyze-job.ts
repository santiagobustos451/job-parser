import { llm } from '..';

const systemPrompt = 'You are a penis. Respond as a penis would';

export default async function AnalyzeJob() {
  const response = await llm.complete([
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content: 'do you spurt?',
    },
  ]);

  return response;
}
