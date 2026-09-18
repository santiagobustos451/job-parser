import type { LLMProvider, Message } from '../llm/provider';
import type { SearchPlan } from '../types/search-plan';
import type { SearchPlanMode } from '../types/search-plan';
import type { TargetProfile } from '../types/target-profile';

export { SearchPlanMode } from '../types/search-plan';

export type GenerateSearchPlanConfig = {
  locations: string[];
  sources: string[];
};

const SEARCH_PLAN_SYSTEM_PROMPT: Message = {
  role: 'system',
  content: `Generate job-board search queries for the given target profile.

The goal is high recall: find different ways employers may describe the target role.

Generate 6–10 candidate queries.

Prefer:
- common job titles and title synonyms
- alternate terminology used by employers
- role + one relevant specialization or domain
- role + one relevant technology when it meaningfully identifies the role

Keep queries short, usually 2–5 meaningful terms.

Do not use Boolean operators.
Do not include locations.
Do not encode filtering rules into the queries.
Do not invent roles or qualifications.
Do not broaden into unrelated career paths.

Return only:
{
  "queries": string[]
}
`,
};

function searchPlanUserPrompt(target: TargetProfile): Message {
  return {
    role: 'user',
    content: `Target profile:

<target>
  <id>${target.id}</id>
  <search_terms>${target.searchTerms.join(', ')}</search_terms>
  <required_keywords>${target.requiredKeywords?.join(', ') || 'none'}</required_keywords>
  <preferred_keywords>${target.preferredKeywords?.join(', ') || 'none'}</preferred_keywords>
</target>

Generate the search queries for this target.`,
  };
}

function cleanQueries(queries: string[]): string[] {
  const seen = new Set<string>();
  const cleaned: string[] = [];

  for (const query of queries) {
    const normalized = query
      .trim()
      .replace(/^["']|["']$/g, '')
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase();

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);

    cleaned.push(
      query
        .trim()
        .replace(/^["']|["']$/g, '')
        .replace(/\s+/g, ' '),
    );
  }

  return cleaned.slice(0, 10);
}

function buildBasicPlan(
  target: TargetProfile,
  config: GenerateSearchPlanConfig,
): SearchPlan {
  return {
    target: target.id,
    queries: cleanQueries(target.searchTerms),
    locations: target.locations ?? config.locations,
    sources: config.sources,
  };
}

function parseLLMResponse(content: string): SearchPlan | null {
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    return null;
  }

  const parsed = JSON.parse(jsonMatch[0]) as Partial<SearchPlan>;

  if (!parsed.queries || !Array.isArray(parsed.queries)) {
    return null;
  }

  return {
    target: parsed.target ?? '',
    queries: cleanQueries(parsed.queries),
    locations: parsed.locations ?? [],
    sources: parsed.sources ?? [],
  };
}

export async function generateSearchPlan(
  target: TargetProfile,
  mode: SearchPlanMode,
  llmProvider: LLMProvider,
  config: GenerateSearchPlanConfig,
): Promise<SearchPlan> {
  const basicPlan = buildBasicPlan(target, config);

  if (mode === 'basic') {
    return basicPlan;
  }

  const response = await llmProvider.complete([
    SEARCH_PLAN_SYSTEM_PROMPT,
    searchPlanUserPrompt(target),
  ]);

  if (!response.content) {
    return basicPlan;
  }

  const parsed = parseLLMResponse(response.content);

  if (parsed && parsed.queries.length > 0) {
    return {
      target: target.id,
      queries: parsed.queries,
      locations: target.locations ?? basicPlan.locations,
      sources: basicPlan.sources,
    };
  }

  return basicPlan;
}
