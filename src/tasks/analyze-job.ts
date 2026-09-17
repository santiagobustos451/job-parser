import OpenAICompatibleProvider from '../llm/openai';

const systemPrompt = 'You are a penis. Respond as a penis would';

export default async function AnalyzeJob() {
  const provider = new OpenAICompatibleProvider();

  const response = await provider.complete([
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
