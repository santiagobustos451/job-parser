import { LLMProvider, LLMResponse, Message } from './provider';
import OpenAI from 'openai';

type OpenAIProviderConfig = {
  apiKey?: string;
  baseURL?: string;
  model?: string;
};

export class OpenAICompatibleProvider implements LLMProvider {
  private client: OpenAI;
  private model: string;

  constructor(config: OpenAIProviderConfig = {}) {
    const apiKey = config.apiKey ?? process.env.LLM_API_KEY;
    const baseURL = config.baseURL ?? process.env.LLM_BASE_URL;
    const model = config.model ?? process.env.LLM_MODEL;

    if (!apiKey || !model) {
      throw new Error('OpenAIProvider: LLM_API_KEY and LLM_MODEL are required');
    }

    // validate required values
    // create client
    this.client = new OpenAI({
      apiKey,
      baseURL,
    });
    // store model
    this.model = model;
  }

  async complete(messages: Message[]): Promise<LLMResponse> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages,
    });

    const choice = response.choices[0];

    return {
      content: choice?.message?.content ?? null,
      finishReason: choice?.finish_reason ?? null,
      usage: response.usage
        ? {
            inputTokens: response.usage.prompt_tokens,
            outputTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
    };
  }
}
