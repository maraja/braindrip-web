/**
 * Remark plugin that transforms cross-references like `filename.md`
 * into proper links. Handles inline code nodes ending in .md.
 *
 * Dynamically scans all courses to build a slug→URL map at build time.
 * When a slug exists in multiple courses, prefers same-course references.
 */
import { visit } from 'unist-util-visit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Global map: conceptSlug → [{ courseSlug, moduleSlug, url }]
let CONCEPT_MAP = null;

function buildConceptMap() {
  if (CONCEPT_MAP) return;
  CONCEPT_MAP = new Map();

  // Try multiple resolution strategies
  const thisDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(thisDir, '..', 'content', 'courses'),
    path.resolve('src/content/courses'),
    path.resolve(process.cwd(), 'src/content/courses'),
  ];

  let coursesDir = null;
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      coursesDir = c;
      break;
    }
  }

  if (!coursesDir) {
    console.warn('[cross-ref] Could not find courses directory');
    return;
  }

  const courses = fs.readdirSync(coursesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const courseSlug of courses) {
    const courseDir = path.join(coursesDir, courseSlug);
    let modules;
    try {
      modules = fs.readdirSync(courseDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
    } catch { continue; }

    for (const moduleDir of modules) {
      const moduleSlug = moduleDir.replace(/^\d+-/, '');
      const modulePath = path.join(courseDir, moduleDir);
      let files;
      try {
        files = fs.readdirSync(modulePath).filter(f => f.endsWith('.md'));
      } catch { continue; }

      for (const file of files) {
        const conceptSlug = file.replace(/\.md$/, '');
        const url = `/courses/${courseSlug}/${moduleSlug}/${conceptSlug}`;

        if (!CONCEPT_MAP.has(conceptSlug)) {
          CONCEPT_MAP.set(conceptSlug, []);
        }
        CONCEPT_MAP.get(conceptSlug).push({ courseSlug, moduleSlug, url });
      }
    }
  }

}

export function remarkCrossReferences() {
  return function (tree, file) {
    buildConceptMap();
    if (!CONCEPT_MAP || CONCEPT_MAP.size === 0) return;

    // Extract current course slug from file path
    const filePath = file.history?.[0] || file.path || '';
    const courseMatch = filePath.match(/courses\/([^/]+)\//);
    const currentCourse = courseMatch ? courseMatch[1] : null;

    visit(tree, 'inlineCode', (node, index, parent) => {
      if (!parent || index == null || !node.value.endsWith('.md')) return;

      const slug = node.value.replace(/\.md$/, '');
      const entries = CONCEPT_MAP.get(slug);

      if (!entries || entries.length === 0) return;

      // Prefer same-course match, fall back to first match
      const match = entries.find(e => e.courseSlug === currentCourse) || entries[0];

      const linkNode = {
        type: 'link',
        url: match.url,
        data: {
          hProperties: {
            'data-concept': slug,
            class: 'concept-link',
          },
        },
        children: [{
          type: 'text',
          value: formatConceptName(slug),
        }],
      };

      parent.children[index] = linkNode;
    });
  };
}

function formatConceptName(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
