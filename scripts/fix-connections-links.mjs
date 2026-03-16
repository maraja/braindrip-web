#!/usr/bin/env node
/**
 * Converts bold concept names in "Connections to Other Concepts" sections
 * into cross-reference links (inline code `.md` references).
 *
 * Transforms: - **Concept Name**: description
 * Into:       - `concept-name.md`: description
 *
 * Only converts when a matching concept file actually exists.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, '../src/content/courses');

// ── Build concept map (slug → file exists) ──

function buildConceptMap() {
  const map = new Map(); // conceptSlug → [{ courseSlug, moduleSlug }]

  const courses = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory()).map(d => d.name);

  for (const courseSlug of courses) {
    const courseDir = path.join(CONTENT_DIR, courseSlug);
    let modules;
    try {
      modules = fs.readdirSync(courseDir, { withFileTypes: true })
        .filter(d => d.isDirectory()).map(d => d.name);
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
        if (!map.has(conceptSlug)) map.set(conceptSlug, []);
        map.get(conceptSlug).push({ courseSlug, moduleSlug });
      }
    }
  }

  return map;
}

// ── Name-to-slug conversion ──

function nameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '')           // Remove apostrophes
    .replace(/[&]/g, 'and')         // & -> and
    .replace(/[^a-z0-9]+/g, '-')    // Non-alphanumeric -> hyphen
    .replace(/^-|-$/g, '')          // Trim leading/trailing hyphens
    .replace(/-+/g, '-');           // Collapse multiple hyphens
}

// Generate multiple slug candidates from a name
function nameToCandidates(name) {
  const base = nameToSlug(name);
  const candidates = [base];

  // CamelCase/PascalCase splitting: "FlashAttention" -> "flash-attention"
  const camelSplit = name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2');
  const camelSlug = nameToSlug(camelSplit);
  if (camelSlug !== base) candidates.push(camelSlug);

  // Strip parenthetical: "RAG (Retrieval-Augmented Generation)" -> "rag"
  const noParens = name.replace(/\s*\([^)]*\)\s*/, '').trim();
  const noParensSlug = nameToSlug(noParens);
  if (noParensSlug !== base) candidates.push(noParensSlug);

  // Handle "X/Y" -> both "x" and "y"
  if (name.includes('/')) {
    for (const part of name.split('/')) {
      candidates.push(nameToSlug(part.trim()));
    }
  }

  // Handle common abbreviations
  const abbrevMap = {
    'llm': 'large-language-model',
    'rlhf': 'rlhf',
    'dpo': 'dpo',
    'rag': 'rag',
    'mcp': 'model-context-protocol',
    'nlp': 'nlp',
    'llm-as-a-judge': 'llm-as-judge',
  };
  if (abbrevMap[base]) candidates.push(abbrevMap[base]);

  return [...new Set(candidates)];
}

// ── Try to find a matching concept for a bold name ──

function findConcept(name, conceptMap, currentCourse) {
  const candidates = nameToCandidates(name);

  // 1. Direct match on any candidate
  for (const slug of candidates) {
    if (conceptMap.has(slug)) return slug;
  }

  // 2. Try removing hyphens from candidates
  for (const slug of candidates) {
    const noHyphen = slug.replace(/-/g, '');
    if (conceptMap.has(noHyphen)) return noHyphen;
  }

  // 3. Try common suffixes
  const suffixes = ['', '-in-agents', '-for-agents', '-systems', '-in-nlp', '-for-nlp'];
  for (const slug of candidates) {
    for (const suffix of suffixes) {
      const try_ = slug + suffix;
      if (try_ !== slug && conceptMap.has(try_)) return try_;
    }
  }

  // 4. Partial match: concept slug starts/ends with our candidate
  for (const slug of candidates) {
    if (slug.length < 3) continue;
    for (const [conceptSlug] of conceptMap) {
      if (conceptSlug.startsWith(slug + '-') || conceptSlug.endsWith('-' + slug)) {
        return conceptSlug;
      }
    }
  }

  // 5. Substring match for longer slugs
  for (const slug of candidates) {
    if (slug.length < 5) continue;
    for (const [conceptSlug] of conceptMap) {
      if (conceptSlug.includes(slug) || slug.includes(conceptSlug)) {
        return conceptSlug;
      }
    }
  }

  return null;
}

// ── Process a file ──

function processFile(filePath, conceptMap) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Find the course slug for this file
  const relPath = path.relative(CONTENT_DIR, filePath);
  const currentCourse = relPath.split(path.sep)[0];

  let inConnectionsSection = false;
  let changed = false;
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect entering/leaving the connections section
    if (/^## Connections to Other Concepts/.test(line)) {
      inConnectionsSection = true;
      newLines.push(line);
      continue;
    }
    if (inConnectionsSection && /^## /.test(line)) {
      inConnectionsSection = false;
    }

    if (!inConnectionsSection) {
      newLines.push(line);
      continue;
    }

    // Pattern 1: **Bold** (`slug.md`): description — remove redundant bold
    const mixedMatch = line.match(/^(\s*-\s+)\*\*[^*]+\*\*\s*\((`[^`]+\.md`)\)(\s*[:—–/-]\s*)(.*)/);
    if (mixedMatch) {
      newLines.push(`${mixedMatch[1]}${mixedMatch[2]}${mixedMatch[3]}${mixedMatch[4]}`);
      changed = true;
      continue;
    }

    // Pattern 1b: **Bold** (`slug.md`) / **Bold** (`slug.md`): description
    const multiMixedMatch = line.match(/^(\s*-\s+)\*\*[^*]+\*\*\s*\((`[^`]+\.md`)\)\s*\/\s*\*\*[^*]+\*\*\s*\((`[^`]+\.md`)\)(?:\s*\/\s*\*\*[^*]+\*\*\s*\((`[^`]+\.md`)\))?(\s*[:—–/-]\s*)(.*)/);
    if (multiMixedMatch) {
      const slugs = [multiMixedMatch[2], multiMixedMatch[3], multiMixedMatch[4]].filter(Boolean).join(' / ');
      newLines.push(`${multiMixedMatch[1]}${slugs}${multiMixedMatch[5]}${multiMixedMatch[6]}`);
      changed = true;
      continue;
    }

    // Pattern 2: **Concept Name**: description (or just **Name** followed by text)
    const boldMatch = line.match(/^(\s*-\s+)\*\*([^*]+)\*\*(\s*[:—–-]\s*|\s+)(.*)/);
    if (boldMatch) {
      const prefix = boldMatch[1];
      const boldName = boldMatch[2];
      let separator = boldMatch[3];
      const description = boldMatch[4];

      // Normalize separator to ": " if it was just whitespace
      if (!separator.match(/[:—–-]/)) separator = ': ';

      // Try to find a matching concept
      const names = boldName.split(/\s*[/&]\s*|\s+and\s+/i);
      let matchedSlug = null;

      for (const name of names) {
        matchedSlug = findConcept(name.trim(), conceptMap, currentCourse);
        if (matchedSlug) break;
      }

      if (!matchedSlug) {
        matchedSlug = findConcept(boldName.trim(), conceptMap, currentCourse);
      }

      if (matchedSlug) {
        newLines.push(`${prefix}\`${matchedSlug}.md\`${separator}${description}`);
        changed = true;
      } else {
        newLines.push(line);
      }
    } else {
      newLines.push(line);
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
  }
  return changed;
}

// ── Walk files ──

function walkFiles(dir, ext = '.md') {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkFiles(full, ext));
    else if (full.endsWith(ext)) results.push(full);
  }
  return results;
}

// ── Main ──

const conceptMap = buildConceptMap();
console.log(`Concept map: ${conceptMap.size} unique concept slugs`);

const files = walkFiles(CONTENT_DIR);
let totalConverted = 0;
let totalLinks = 0;
let totalKept = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('## Connections to Other Concepts')) continue;
  if (!content.includes('**')) continue; // No bold items

  // Count bold items in connections section
  const section = content.match(/## Connections to Other Concepts\n([\s\S]*?)(?=\n## |\n$)/);
  if (!section) continue;
  const boldCount = (section[1].match(/\*\*[^*]+\*\*/g) || []).length;

  const oldContent = fs.readFileSync(file, 'utf-8');
  const changed = processFile(file, conceptMap);

  if (changed) {
    const newContent = fs.readFileSync(file, 'utf-8');
    const newSection = newContent.match(/## Connections to Other Concepts\n([\s\S]*?)(?=\n## |\n$)/);
    const newBoldCount = newSection ? (newSection[1].match(/\*\*[^*]+\*\*/g) || []).length : 0;
    const converted = boldCount - newBoldCount;
    totalLinks += converted;
    totalKept += newBoldCount;
    totalConverted++;
  }
}

console.log(`\nProcessed ${totalConverted} files`);
console.log(`Converted ${totalLinks} bold names to cross-reference links`);
console.log(`Kept ${totalKept} bold names (no matching concept found)`);
