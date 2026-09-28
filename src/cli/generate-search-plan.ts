import 'dotenv/config';

import { OpenAICompatibleProvider } from '../llm/openai';
import type { LLMProvider } from '../llm/provider';
import {
  generateSearchPlan,
  SearchPlanMode,
} from '../tasks/generate-search-plan';
import { targetProfiles } from '../data/target-profiles';
import type { TargetProfile } from '../types/target-profile';
import type { SearchPlan } from '../types/search-plan';
import { dirname, join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { getArg } from './lib/helpers';

function isSearchPlanMode(value: string | undefined): value is SearchPlanMode {
  return value === 'basic' || value === 'llm';
}

function selectTargets(targetName: string | undefined): TargetProfile[] {
  const allTargets = targetProfiles;

  if (!targetName) {
    return allTargets;
  }

  const selected = allTargets.filter((t) => t.name === targetName);

  if (selected.length === 0) {
    throw new Error(`Target "${targetName}" not found`);
  }

  return selected;
}

async function main() {
  const targetName = getArg('--target');
  const modeArg = getArg('--mode');

  if (!isSearchPlanMode(modeArg)) {
    throw new Error('Invalid --mode. Expected "basic" or "llm"');
  }

  const selectedTargets = selectTargets(targetName);

  // Build config from environment
  const config = {
    locations: ['remote'],
    sources: process.env.PLATFORMS?.split(',').filter(Boolean) ?? ['linkedin'],
  };

  // Create LLM provider only for llm mode
  let llmProvider: LLMProvider | undefined;

  if (modeArg === 'llm') {
    llmProvider = new OpenAICompatibleProvider();
  }

  const plans: SearchPlan[] = [];

  for (const target of selectedTargets) {
    console.log(`Generating search plan for: ${target.name}`);

    if (modeArg === 'basic') {
      const plan = await generateSearchPlan(
        target,
        'basic',
        llmProvider!,
        config,
      );
      plans.push(plan);
    } else {
      if (!llmProvider) {
        throw new Error('LLM provider required for llm mode');
      }
      const plan = await generateSearchPlan(target, 'llm', llmProvider, config);
      plans.push(plan);
    }
  }

  const outputPath = join(
    process.cwd(),
    'src',
    'data',
    'generated',
    `search-plans-${modeArg}.json`,
  );

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(plans, null, 2), 'utf8');

  console.log(`\nSearch plans written to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
