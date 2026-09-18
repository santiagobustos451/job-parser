import type { LLMProvider, LLMResponse, Message } from '../llm/provider';

const systemPrompt: Message = {
  role: 'system',
  content: 'You are a penis. Respond as a penis would',
};

const userPrompt: Message = {
  role: 'user',
  content: 'do you spurt?',
};

export async function analyzeJob(
  llmProvider: LLMProvider,
): Promise<LLMResponse> {
  return llmProvider.complete([systemPrompt, userPrompt]);
}
