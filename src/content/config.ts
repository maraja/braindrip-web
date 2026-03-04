import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const concepts = defineCollection({
  loader: glob({
    pattern: '{01-foundational-architecture,02-input-representation,03-training-fundamentals,04-distributed-training,05-alignment-and-post-training,06-parameter-efficient-fine-tuning,07-inference-and-deployment,08-practical-applications,09-safety-and-alignment,10-evaluation,11-advanced-and-emerging}/*.md',
    base: 'src/content/llm-concepts',
  }),
  schema: z.object({}).passthrough(),
});

export const collections = { concepts };
