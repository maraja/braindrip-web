import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const courses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/courses' }),
  schema: z.object({}).passthrough(),
});

export const collections = { courses };
