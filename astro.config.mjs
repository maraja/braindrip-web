import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import remarkSmartypants from 'remark-smartypants';
import rehypeKatex from 'rehype-katex';
import { remarkExtractMetadata } from './src/plugins/remark-extract-metadata.mjs';
import { remarkCrossReferences } from './src/plugins/remark-cross-references.mjs';
import { rehypeConceptImages } from './src/plugins/rehype-concept-images.mjs';
import { rehypeInteractiveMarkers } from './src/plugins/rehype-interactive-markers.mjs';
import { rehypeFurtherReading } from './src/plugins/rehype-further-reading.mjs';

export default defineConfig({
  site: 'https://braindrip.vercel.app',
  integrations: [
    react(),
    tailwind(),
  ],
  markdown: {
    remarkPlugins: [
      remarkExtractMetadata,
      remarkMath,
      [remarkSmartypants, { dashes: 'oldschool' }],
      remarkCrossReferences,
    ],
    rehypePlugins: [
      [rehypeKatex, { strict: false, throwOnError: false }],
      rehypeConceptImages,
      rehypeFurtherReading,
      rehypeInteractiveMarkers,
    ],
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
