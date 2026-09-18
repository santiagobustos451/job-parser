import 'dotenv/config';

import GenerateSearchPlan, {
  SearchPlanMode,
} from '../tasks/generate-search-plan';
import targets from '../data/target-profiles';
import { SearchPlan } from '../types/search-plan';
import { dirname, join } from 'path';
import { mkdir, writeFile } from 'fs/promises';

function getArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);

  if (index === -1) {
    return undefined;
  }

  return process.argv[index + 1];
}

function isSearchPlanMode(value: string | undefined): value is SearchPlanMode {
  return value === 'basic' || value === 'llm';
}

async function main() {
  const targetName = getArg('--target');
  const modeArg = getArg('--mode');

  if (!isSearchPlanMode(modeArg)) {
    throw new Error('Invalid --mode. Expected "basic" or "llm"');
  }

  const selectedTargets = targetName
    ? targets.filter((target) => target.name === targetName)
    : targets;

  if (selectedTargets.length === 0) {
    throw new Error(`Target "${targetName}" not found`);
  }

  const plans: SearchPlan[] = [];

  for (const target of selectedTargets) {
    console.log(`Generating search plan for: ${target.name}`);

    const plan = await GenerateSearchPlan(target, modeArg);

    plans.push(plan);
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
