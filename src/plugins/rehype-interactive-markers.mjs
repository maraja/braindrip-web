/**
 * Rehype plugin that injects interactive element markers into the HTML AST.
 *
 * For each concept, looks up which interactive components should be placed
 * and after which h2 section they belong. Injects a <div data-interactive="...">
 * placeholder that the client-side React hydrator will mount components into.
 *
 * Registry entries support two matching modes:
 *   - afterSection: exact match on h2 text
 *   - afterSectionStartsWith: prefix match on h2 text (e.g. "What Is")
 *
 * Registry keys can be:
 *   - "concept-slug" (legacy, for llm-concepts)
 *   - "course-slug/concept-slug" (for multi-course support)
 */
import { interactiveRegistry } from '../data/interactive-registry.mjs';

export function rehypeInteractiveMarkers() {
  return function (tree, file) {
    // Extract concept slug and course slug from file path
    // Normalize backslashes to forward slashes for cross-platform compatibility
    const filePath = (file.history?.[0] || file.path || '').replace(/\\/g, '/');

    // Try multiple path patterns to extract course slug and concept slug.
    // Different build environments (local, Vercel, etc.) may produce different path formats.
    const patterns = [
      // .../courses/course-slug/module-dir/concept.md (standard local path)
      /courses\/([^/]+)\/[^/]+\/([^/]+)\.md$/,
      // .../courses/course-slug/module-dir/concept.mdx
      /courses\/([^/]+)\/[^/]+\/([^/]+)\.mdx$/,
      // Astro content collection ID format: course-slug/module-dir/concept.md
      /^([^/]+)\/[^/]+\/([^/]+)\.mdx?$/,
      // Any path with courses/ followed by 2+ segments
      /courses\/([^/]+)\/(?:[^/]+\/)*([^/]+)\.mdx?$/,
    ];

    let courseSlug = null;
    let slug = null;

    for (const pattern of patterns) {
      const match = filePath.match(pattern);
      if (match) {
        courseSlug = match[1];
        slug = match[2];
        break;
      }
    }

    // Fallback: just extract the filename as slug
    if (!slug) {
      const simpleMatch = filePath.match(/([^/]+)\.mdx?$/);
      if (!simpleMatch) return;
      slug = simpleMatch[1];
    }

    // Also try to extract course slug from Astro's file.data if available
    if (!courseSlug && file.data?.astro?.frontmatter?.courseSlug) {
      courseSlug = file.data.astro.frontmatter.courseSlug;
    }

    // Look up registry: try course-qualified key first, then plain slug
    const compositeKey = courseSlug ? `${courseSlug}/${slug}` : null;
    let config = (compositeKey && interactiveRegistry[compositeKey]) || interactiveRegistry[slug];

    // If no match yet, try matching registry keys ending with the slug.
    // Only use this fallback when there's exactly one match (no ambiguity).
    if (!config && slug) {
      const matches = [];
      for (const key of Object.keys(interactiveRegistry)) {
        if (key.endsWith('/' + slug)) {
          matches.push(key);
        }
      }
      if (matches.length === 1) {
        config = interactiveRegistry[matches[0]];
      }
    }

    if (!config || config.length === 0) return;

    // Separate exact-match and prefix-match entries
    const exactMap = {};   // afterSection text → [component names]
    const prefixMap = {};  // prefix string → [component names]

    for (const item of config) {
      if (item.afterSectionStartsWith) {
        const key = item.afterSectionStartsWith;
        if (!prefixMap[key]) prefixMap[key] = [];
        prefixMap[key].push(item.component);
      } else if (item.afterSection) {
        if (!exactMap[item.afterSection]) exactMap[item.afterSection] = [];
        exactMap[item.afterSection].push(item.component);
      }
    }

    const prefixKeys = Object.keys(prefixMap);

    // Walk the tree to find h2 elements and inject markers after their sections
    const children = tree.children;
    const insertions = []; // { index, components[] }

    for (let i = 0; i < children.length; i++) {
      const node = children[i];

      // Check if this is an h2 element
      if (node.type === 'element' && node.tagName === 'h2') {
        // Get the text content of the heading
        const headingText = getTextContent(node).trim();

        // Check exact match first, then prefix match
        let matched = null;
        if (exactMap[headingText]) {
          matched = exactMap[headingText];
        } else {
          for (const prefix of prefixKeys) {
            if (headingText.startsWith(prefix)) {
              matched = prefixMap[prefix];
              break;
            }
          }
        }

        if (matched) {
          // Find the end of this section (next h2 or end of document)
          let sectionEnd = children.length;
          for (let j = i + 1; j < children.length; j++) {
            if (children[j].type === 'element' && children[j].tagName === 'h2') {
              sectionEnd = j;
              break;
            }
          }

          // Insert markers just before the next h2 (at sectionEnd)
          insertions.push({
            index: sectionEnd,
            components: matched,
          });
        }
      }
    }

    // Insert in reverse order to preserve indices
    insertions.sort((a, b) => b.index - a.index);
    for (const ins of insertions) {
      for (let c = ins.components.length - 1; c >= 0; c--) {
        const markerNode = {
          type: 'element',
          tagName: 'div',
          properties: {
            'data-interactive': ins.components[c],
            className: ['interactive-slot'],
          },
          children: [],
        };
        children.splice(ins.index, 0, markerNode);
      }
    }
  };
}

function getTextContent(node) {
  if (node.type === 'text') return node.value || '';
  if (node.children) return node.children.map(getTextContent).join('');
  return '';
}
