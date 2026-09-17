export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type LLMResponse = {
  content: string | null;
  finishReason: string | null;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
};

export interface LLMProvider {
  complete(messages: Message[]): Promise<LLMResponse>;
}
