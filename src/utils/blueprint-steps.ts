import { getCollection } from 'astro:content';

function parseStepId(id: string) {
  const parts = id.replace(/\.md$/, '').split('/');
  if (parts.length >= 3) {
    return {
      blueprintSlug: parts[0],
      moduleDir: parts[1],
      moduleSlug: parts[1].replace(/^\d+-/, ''),
      stepSlug: parts[parts.length - 1],
    };
  }
  if (parts.length === 2) {
    return {
      blueprintSlug: parts[0],
      moduleDir: parts[0],
      moduleSlug: parts[0],
      stepSlug: parts[1],
    };
  }
  return {
    blueprintSlug: 'unknown',
    moduleDir: 'unknown',
    moduleSlug: 'unknown',
    stepSlug: parts[0],
  };
}

export async function getAllSteps(blueprintSlug?: string) {
  const entries = await getCollection('blueprints');
  const mapped = entries.map(entry => {
    const { blueprintSlug: bs, moduleSlug, stepSlug } = parseStepId(entry.id);
    return {
      ...entry,
      slug: stepSlug,
      blueprintSlug: bs,
      moduleSlug,
      url: `/blueprints/${bs}/${moduleSlug}/${stepSlug}`,
    };
  });
  if (blueprintSlug) {
    return mapped.filter(s => s.blueprintSlug === blueprintSlug);
  }
  return mapped;
}

export async function getModuleSteps(blueprintSlug: string, moduleSlug: string) {
  const steps = await getAllSteps(blueprintSlug);
  return steps
    .filter(s => s.moduleSlug === moduleSlug)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getStepPrevNext(steps: { slug: string }[], currentSlug: string) {
  const idx = steps.findIndex(s => s.slug === currentSlug);
  return {
    prev: idx > 0 ? steps[idx - 1].slug : null,
    next: idx < steps.length - 1 ? steps[idx + 1].slug : null,
  };
}
