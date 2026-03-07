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
    const filePath = file.history?.[0] || file.path || '';

    // Try to extract course/concept from path like .../courses/course-slug/module-dir/concept.md
    const courseMatch = filePath.match(/courses\/([^/]+)\/[^/]+\/([^/]+)\.md$/);
    const simpleMatch = filePath.match(/([^/]+)\.md$/);

    if (!courseMatch && !simpleMatch) return;

    const slug = courseMatch ? courseMatch[2] : simpleMatch[1];
    const courseSlug = courseMatch ? courseMatch[1] : null;

    // Look up registry: try course-qualified key first, then plain slug
    const compositeKey = courseSlug ? `${courseSlug}/${slug}` : null;
    const config = (compositeKey && interactiveRegistry[compositeKey]) || interactiveRegistry[slug];
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
