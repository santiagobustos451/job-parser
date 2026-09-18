import { llm } from '..';
import { SearchPlan } from '../types/search-plan';
import { TargetProfile } from '../types/target-profile';

export type SearchPlanMode = 'basic' | 'llm';

const SEARCH_PLAN_SYSTEM_PROMPT = `
Generate job-board search queries for the given target profile.

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
`;

const SEARCH_PLAN_USER_PROMPT_TEMPLATE = (target: TargetProfile): string => `
Target profile:

<target>
  <id>${target.id}</id>
  <search_terms>${target.searchTerms.join(', ')}</search_terms>
  <required_keywords>${target.requiredKeywords?.join(', ') || 'none'}</required_keywords>
  <preferred_keywords>${target.preferredKeywords?.join(', ') || 'none'}</preferred_keywords>
</target>

Generate the search queries for this target.
`;

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

export default async function GenerateSearchPlan(
  target: TargetProfile,
  mode: SearchPlanMode = 'basic',
): Promise<SearchPlan> {
  const basicPlan: SearchPlan = {
    target: target.id,
    queries: cleanQueries(target.searchTerms),
    locations: target.locations ?? ['remote'],
    sources: process.env.PLATFORMS?.split(',') ?? ['linkedin'],
  };

  if (mode === 'basic') {
    return basicPlan;
  }

  const response = await llm.complete([
    {
      role: 'system',
      content: SEARCH_PLAN_SYSTEM_PROMPT,
    },
    {
      role: 'user',
      content: SEARCH_PLAN_USER_PROMPT_TEMPLATE(target),
    },
  ]);

  if (!response.content) {
    return basicPlan;
  }

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return basicPlan;
    }

    const parsed = JSON.parse(jsonMatch[0]) as Partial<SearchPlan>;

    if (!parsed.queries || !Array.isArray(parsed.queries)) {
      return basicPlan;
    }

    const queries = cleanQueries(parsed.queries);

    if (queries.length === 0) {
      return basicPlan;
    }

    return {
      target: target.id,
      queries,
      locations: target.locations ?? ['remote'],
      sources: process.env.PLATFORMS?.split(',') ?? ['linkedin'],
    };
  } catch {
    return basicPlan;
  }
}
