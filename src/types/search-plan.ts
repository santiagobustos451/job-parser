export type SearchPlan = {
  target: string;
  queries: string[];
  locations: string[];
  sources: string[];
};

export type SearchPlanMode = 'basic' | 'llm';
