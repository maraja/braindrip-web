#!/usr/bin/env node
/**
 * Converts "*Recommended visual: ..." placeholder lines in markdown files
 * into Mermaid diagram code blocks.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, '../src/content/courses');

function walkFiles(dir, ext = '.md') {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkFiles(full, ext));
    else if (full.endsWith(ext)) results.push(full);
  }
  return results;
}

// ── Label sanitizer ──
function s(text, maxLen = 42) {
  if (!text) return '...';
  return text
    .replace(/["\[\]{}#&<>\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, maxLen);
}

let _id = 0;
function id(p = 'N') { return `${p}${++_id}`; }
function resetId() { _id = 0; }

function cleanDesc(raw) {
  let d = raw.replace(/^\*Recommended visual:\s*/, '').replace(/\*$/, '').trim();
  // Remove trailing references
  d = d.replace(/\s*[-—–]+\s*(?:see|from|based on|adapted from|inspired by|Source:)\s*\[.*$/is, '');
  d = d.replace(/\s*[-—–]+\s*(?:see|from)\s+\(.*$/is, '');
  return d.trim();
}

// ═══ EXTRACTION ═══

/**
 * The main extraction function. Tries multiple strategies to extract
 * structured items from a description.
 */
function extractItems(desc) {
  let items;

  // Strategy 1: Explicit arrow chains "A" -> "B" -> "C" or A -> B -> C
  items = tryArrowChain(desc);
  if (items && items.length >= 2) return { items, type: 'pipeline' };

  // Strategy 2: Explicit levels "Level 0 (X) ... Level 1 (Y)"
  items = tryLevels(desc);
  if (items && items.length >= 2) return { items, type: 'levels' };

  // Strategy 3: Quoted items like "System/Platform", "Developer", etc.
  items = tryQuotedItems(desc);
  if (items && items.length >= 2) return { items, type: 'list' };

  // Strategy 4: "X (detail), Y (detail), and Z (detail)" - items with paren details
  items = tryItemsWithParenDetails(desc);
  if (items && items.length >= 2) return { items, type: 'list' };

  // Strategy 5: Single paren with comma list "(a, b, c, d)"
  items = trySingleParenList(desc);
  if (items && items.length >= 3) return { items, type: 'list' };

  // Strategy 6: Multiple parenthesized items "(X)" ... "(Y)" ... "(Z)"
  items = tryMultiParen(desc);
  if (items && items.length >= 2) return { items, type: 'list' };

  // Strategy 7: Dash-separated key concepts "X -- Y -- Z"
  items = tryDashSeparated(desc);
  if (items && items.length >= 3) return { items, type: 'pipeline' };

  // Strategy 8: Comma list after double-dash: "intro -- X, Y, Z, and W"
  items = tryCommaAfterDash(desc);
  if (items && items.length >= 3) return { items, type: 'list' };

  // Strategy 9: "through/from X, Y, Z, and W" embedded in prose
  items = tryEmbeddedCommaList(desc);
  if (items && items.length >= 3) return { items, type: 'list' };

  // Strategy 10: Comma/semicolon series after "showing" or ":"
  items = tryCommaSeries(desc);
  if (items && items.length >= 2) return { items, type: 'list' };

  // Strategy 11: Extract "with X and Y" or "X, Y, and Z" patterns
  items = tryAndList(desc);
  if (items && items.length >= 2) return { items, type: 'list' };

  // Strategy 12: Any comma list of 3+ items anywhere
  items = tryAnyCommaList(desc);
  if (items && items.length >= 3) return { items, type: 'list' };

  // Strategy 13: Extract from natural language patterns
  items = tryNaturalExtraction(desc);
  if (items && items.length >= 2) return { items, type: 'list' };

  return null;
}

function tryQuotedItems(desc) {
  // Extract items in quotes: "System/Platform", "Developer", "User"
  const quoted = [...desc.matchAll(/"([^"]{2,50})"/g)].map(m => m[1]);
  if (quoted.length >= 3) return quoted;
  // Also try single-quote variants
  const singleQ = [...desc.matchAll(/['']([^'']{2,50})['']/g)].map(m => m[1]);
  if (singleQ.length >= 3) return singleQ;
  return null;
}

function tryItemsWithParenDetails(desc) {
  // Pattern: "item1 (detail), item2 (detail), and item3 (detail)"
  // Extract "word-or-phrase (detail)" pairs
  const matches = [...desc.matchAll(/([A-Za-z][\w\s/-]{1,35}?)\s*\(([^)]{2,60})\)/g)];
  if (matches.length >= 2) {
    return matches.map(m => {
      const main = m[1].trim();
      const detail = m[2].trim();
      // If detail is short, combine; otherwise just use main
      if (detail.length < 30) return `${main} (${detail})`;
      return main;
    });
  }
  return null;
}

function tryArrowChain(desc) {
  // Quoted arrow chain: "A" -> "B" -> "C"
  if (desc.includes('->') || desc.includes('→')) {
    const quoted = [...desc.matchAll(/"([^"]{2,45})"/g)].map(m => m[1]);
    if (quoted.length >= 2) return quoted;

    // Unquoted arrow chain
    const parts = desc.split(/\s*(?:->|→|➔)\s*/).map(p => p.trim()).filter(p => p.length > 1 && p.length < 50);
    if (parts.length >= 2) {
      // Clean up first and last
      return parts.map(p => {
        // Remove leading text before the chain starts
        const cleaned = p.replace(/^.*?(?:showing|:)\s*/i, '');
        return cleaned || p;
      });
    }
  }
  return null;
}

function tryLevels(desc) {
  const levels = [...desc.matchAll(/(?:Level|Tier|Layer|Rung|Stage|Phase|Step)\s*(\d+)[:\s]*[(\[]?([^,;)\]—–]{3,50})[)\]]?/gi)];
  if (levels.length >= 2) {
    return levels.map(m => `Level ${m[1]}: ${m[2].trim()}`);
  }
  return null;
}

function trySingleParenList(desc) {
  // Find a parenthesized group that contains a comma-separated list
  const match = desc.match(/\(([^)]{10,200})\)/);
  if (!match) return null;
  const inner = match[1];
  const items = inner.split(/\s*,\s*(?:and\s+)?/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 60);
  if (items.length >= 3) return items;
  return null;
}

function tryMultiParen(desc) {
  const items = [...desc.matchAll(/\(([^)]{2,50})\)/g)].map(m => m[1]);
  // Filter out things like "(x-axis)" or "(2023)" that are metadata
  const filtered = items.filter(i => !i.match(/^[xy]-axis|^\d{4}$|^log scale$|^default|^\d+%$/i));
  if (filtered.length >= 2) return filtered;
  return null;
}

function tryCommaAfterDash(desc) {
  // "intro -- X, Y, Z, and W" or "intro -- X, Y, and Z -- more detail"
  const dashParts = desc.split(/\s+--\s+/);
  if (dashParts.length >= 2) {
    // Try each dash-separated part for comma lists
    for (const part of dashParts) {
      const items = part
        .split(/\s*(?:,\s*(?:and\s+)?|\s+and\s+)\s*/)
        .map(s => s.trim())
        .filter(s => s.length > 2 && s.length < 55);
      if (items.length >= 3) return items.slice(0, 8);
    }
  }
  return null;
}

function tryEmbeddedCommaList(desc) {
  // "through X, Y, Z, and W" or "from X to Y through Z"
  const patterns = [
    /(?:through|across|between|from|into|showing)\s+(.+?)(?:\s*[-—–]\s|$)/i,
    /(?:flow|stages?|steps?|phases?|components?):\s*(.+?)(?:\s*[-—–]\s|$)/i,
  ];
  for (const pat of patterns) {
    const match = desc.match(pat);
    if (match) {
      const items = match[1]
        .split(/\s*(?:,\s*(?:and\s+)?|,?\s+(?:and|then|through|to)\s+)\s*/)
        .map(s => s.trim())
        .filter(s => s.length > 2 && s.length < 55);
      if (items.length >= 3) return items.slice(0, 8);
    }
  }
  return null;
}

function tryAnyCommaList(desc) {
  // Strategy A: Collect items from ALL parenthesized groups
  const allParenItems = [];
  for (const m of desc.matchAll(/\(([^)]{3,100})\)/g)) {
    const inner = m[1];
    // If it contains commas, split it
    if (inner.includes(',')) {
      const parts = inner.split(/\s*,\s*(?:and\s+)?/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 55);
      allParenItems.push(...parts);
    } else {
      allParenItems.push(inner);
    }
  }
  if (allParenItems.length >= 3) return allParenItems.slice(0, 8);

  // Strategy B: Remove parens and try comma split on remaining text
  const cleaned = desc.replace(/\([^)]*\)/g, '');
  const items = cleaned
    .split(/\s*(?:,\s*(?:and\s+)?)\s*/)
    .map(s => s.trim())
    .filter(s => s.length > 3 && s.length < 55);
  if (items.length >= 3) return items.slice(0, 8);

  // Strategy C: Try splitting on "and" alone
  const andItems = desc
    .split(/\s+and\s+/i)
    .map(s => s.trim())
    .filter(s => s.length > 3 && s.length < 60);
  if (andItems.length >= 3) return andItems.slice(0, 6);

  return null;
}

function tryDashSeparated(desc) {
  // "X -- Y -- Z" pattern
  const parts = desc.split(/\s*[-—–]{2,3}\s*/).map(p => p.trim()).filter(p => p.length > 3 && p.length < 80);
  if (parts.length >= 3) return parts;
  return null;
}

function tryCommaSeries(desc) {
  // After "showing", "including", ":", "with"
  const match = desc.match(/(?:showing|including|containing|stages?:|steps?:|phases?:|components?:)\s+(.+)/i);
  if (!match) return null;
  const text = match[1];
  const items = text
    .split(/\s*(?:,\s*(?:and\s+)?|;\s*)\s*/)
    .map(s => s.trim())
    .filter(s => s.length > 3 && s.length < 60);
  if (items.length >= 2) return items.slice(0, 8);
  return null;
}

function tryAndList(desc) {
  // "X, Y, and Z" as a top-level list
  const match = desc.match(/(?:showing|with|illustrating)\s+(.+?)(?:\s*[-—–]|$)/i);
  if (!match) return null;
  const text = match[1];
  const items = text
    .split(/\s*(?:,\s*(?:and\s+)?|\s+and\s+)\s*/)
    .map(s => s.trim())
    .filter(s => s.length > 3 && s.length < 60);
  if (items.length >= 3) return items.slice(0, 8);
  return null;
}

function tryNaturalExtraction(desc) {
  // Extract noun phrases after "showing" up to reasonable boundaries
  const match = desc.match(/showing\s+(?:the\s+|a\s+|an\s+)?(.+)/i);
  if (!match) return null;
  const rest = match[1];

  // Split by natural sentence-level boundaries
  const clauses = rest
    .split(/\s*(?:,\s*|;\s*|\.\s+|(?:where|which|that|then|while|before|after|into|producing|resulting)\s+)/i)
    .map(s => s.trim())
    .filter(s => s.length > 5 && s.length < 60);

  if (clauses.length >= 2) return clauses.slice(0, 6);
  return null;
}

// ═══ DIAGRAM TYPE DETECTION ═══

function detectDiagramType(desc) {
  const lower = desc.toLowerCase();

  if (lower.includes(' vs ') || lower.includes(' vs.') || lower.includes(' versus '))
    return 'comparison';
  if (lower.includes('comparison') || lower.includes('comparing') ||
      lower.includes('side-by-side') || lower.includes('side by side') ||
      lower.includes('before-and-after') || lower.includes('before and after'))
    return 'comparison';
  if (lower.includes('2x2') || lower.includes('quadrant'))
    return 'matrix';
  if (lower.includes('pipeline') || lower.includes('ci/cd') || lower.includes('workflow'))
    return 'pipeline';
  if (lower.includes('hierarch') || lower.includes('tree') || lower.includes('taxonomy'))
    return 'hierarchy';
  if (lower.includes('funnel'))
    return 'funnel';
  if (lower.includes('layer') || lower.includes('stack') || lower.includes('tier') ||
      lower.includes('spectrum') || lower.includes('gradient') || lower.includes('scale'))
    return 'vertical';
  if (lower.includes('branch') || lower.includes('decision') || lower.includes('rout') ||
      lower.includes('classif') || lower.includes('categor'))
    return 'branching';
  if (lower.includes('loop') || lower.includes('cycle') || lower.includes('iterative') ||
      lower.includes('feedback') || lower.includes('recursive'))
    return 'loop';
  if (lower.includes('architecture') || lower.includes('component'))
    return 'architecture';
  if (lower.includes('sequence') || lower.includes('conversation') || lower.includes('multi-turn'))
    return 'sequence';
  if (lower.includes('chart') || lower.includes('bar') || lower.includes('graph') ||
      lower.includes('curve') || lower.includes('plot'))
    return 'pipeline'; // Represent chart concepts as flows
  return 'pipeline'; // Default
}

// ═══ SUBJECT EXTRACTION ═══

function extractSubject(desc) {
  // Extract the main noun phrase
  const match = desc.match(/^(?:An?\s+)?(.+?)(?:\s+(?:showing|illustrating|comparing|displaying|demonstrating|with|where))/i);
  if (match) return s(match[1], 45);
  return s(desc.split(/[,;—–]/)[0], 45);
}

// ═══ DIAGRAM BUILDERS ═══

function buildDiagram(items, type, desc) {
  switch (type) {
    case 'comparison': return buildComparison(items, desc);
    case 'matrix': return buildMatrix(items, desc);
    case 'hierarchy': return buildHierarchy(items, desc);
    case 'branching': return buildBranching(items, desc);
    case 'vertical': return buildVertical(items, desc);
    case 'funnel': return buildVertical(items, desc);
    case 'loop': return buildLoop(items, desc);
    case 'architecture': return buildArchitecture(items, desc);
    case 'levels': return buildVertical(items, desc);
    case 'pipeline':
    default: return buildPipeline(items, desc);
  }
}

function buildPipeline(items, desc) {
  const lines = ['flowchart LR'];
  const ids = [];
  for (const item of items.slice(0, 7)) {
    const nid = id('S');
    ids.push(nid);
    lines.push(`    ${nid}["${s(item)}"]`);
  }
  for (let i = 0; i < ids.length - 1; i++) {
    lines.push(`    ${ids[i]} --> ${ids[i + 1]}`);
  }
  return lines.join('\n');
}

function buildVertical(items, desc) {
  const lines = ['flowchart TD'];
  const ids = [];
  for (const item of items.slice(0, 7)) {
    const nid = id('L');
    ids.push(nid);
    lines.push(`    ${nid}["${s(item)}"]`);
  }
  for (let i = 0; i < ids.length - 1; i++) {
    lines.push(`    ${ids[i]} --> ${ids[i + 1]}`);
  }
  return lines.join('\n');
}

function buildLoop(items, desc) {
  const lines = ['flowchart TD'];
  const ids = [];
  for (const item of items.slice(0, 6)) {
    const nid = id('L');
    ids.push(nid);
    lines.push(`    ${nid}["${s(item)}"]`);
  }
  for (let i = 0; i < ids.length - 1; i++) {
    lines.push(`    ${ids[i]} --> ${ids[i + 1]}`);
  }
  if (ids.length >= 2) {
    lines.push(`    ${ids[ids.length - 1]} -.->|"repeat"| ${ids[0]}`);
  }
  return lines.join('\n');
}

function buildComparison(items, desc) {
  // Try to split items into two groups
  let leftLabel, rightLabel, leftItems, rightItems;

  // Check for explicit "X vs Y" in description
  const vsMatch = desc.match(/(.{3,40}?)\s+(?:vs\.?|versus)\s+(.{3,40})(?:\s|,|;|$)/i);
  if (vsMatch) {
    leftLabel = vsMatch[1].replace(/^.*(?:showing|comparing|between)\s+/i, '').trim();
    rightLabel = vsMatch[2].trim();
  }

  if (!leftLabel && items.length >= 2) {
    leftLabel = items[0];
    rightLabel = items[1];
    items = items.slice(2);
  }

  if (!leftLabel) {
    leftLabel = 'Approach A';
    rightLabel = 'Approach B';
  }

  const lines = ['flowchart LR'];
  const lid = id('L');
  const rid = id('R');
  lines.push(`    subgraph ${lid}["${s(leftLabel)}"]`);
  const leftChildren = items.length > 0 ? items.slice(0, Math.ceil(items.length / 2)) : ['Feature 1'];
  for (const item of leftChildren) {
    lines.push(`        ${id('LI')}["${s(item)}"]`);
  }
  lines.push('    end');
  lines.push(`    subgraph ${rid}["${s(rightLabel)}"]`);
  const rightChildren = items.length > 2 ? items.slice(Math.ceil(items.length / 2)) : ['Feature 1'];
  for (const item of rightChildren) {
    lines.push(`        ${id('RI')}["${s(item)}"]`);
  }
  lines.push('    end');

  return lines.join('\n');
}

function buildMatrix(items, desc) {
  const subject = extractSubject(desc);
  const q = items.slice(0, 4);
  while (q.length < 4) q.push('...');

  const lines = ['flowchart TD'];
  const tid = id('T');
  lines.push(`    ${tid}["${s(subject)}"]`);
  const r1 = id('ROW');
  const r2 = id('ROW');
  lines.push(`    subgraph ${r1}[" "]`);
  lines.push(`        ${id('Q')}["${s(q[0])}"]`);
  lines.push(`        ${id('Q')}["${s(q[1])}"]`);
  lines.push('    end');
  lines.push(`    subgraph ${r2}[" "]`);
  lines.push(`        ${id('Q')}["${s(q[2])}"]`);
  lines.push(`        ${id('Q')}["${s(q[3])}"]`);
  lines.push('    end');
  lines.push(`    ${tid} --- ${r1}`);
  lines.push(`    ${tid} --- ${r2}`);
  return lines.join('\n');
}

function buildHierarchy(items, desc) {
  const subject = extractSubject(desc);
  const lines = ['flowchart TD'];
  const rootId = id('R');
  lines.push(`    ${rootId}["${s(subject)}"]`);
  for (const item of items.slice(0, 8)) {
    const cid = id('C');
    lines.push(`    ${cid}["${s(item)}"]`);
    lines.push(`    ${rootId} --> ${cid}`);
  }
  return lines.join('\n');
}

function buildBranching(items, desc) {
  const subject = extractSubject(desc);
  const lines = ['flowchart TD'];
  const rootId = id('D');
  lines.push(`    ${rootId}{"${s(subject)}"}`);
  for (const item of items.slice(0, 6)) {
    const bid = id('B');
    lines.push(`    ${bid}["${s(item)}"]`);
    lines.push(`    ${rootId} --> ${bid}`);
  }
  return lines.join('\n');
}

function buildArchitecture(items, desc) {
  const lines = ['flowchart TD'];
  const ids = [];
  for (const item of items.slice(0, 6)) {
    const cid = id('C');
    ids.push(cid);
    lines.push(`    ${cid}["${s(item)}"]`);
  }
  for (let i = 0; i < ids.length - 1; i++) {
    lines.push(`    ${ids[i]} --> ${ids[i + 1]}`);
  }
  const lower = desc.toLowerCase();
  if ((lower.includes('loop') || lower.includes('feedback') || lower.includes('iterative')) && ids.length >= 2) {
    lines.push(`    ${ids[ids.length - 1]} -.-> ${ids[0]}`);
  }
  return lines.join('\n');
}

// ═══ MAIN CONVERSION ═══

function descriptionToMermaid(desc) {
  const extraction = extractItems(desc);
  const type = detectDiagramType(desc);

  if (extraction) {
    // Use extracted items with the detected type
    // But override type if extraction detected something specific
    const finalType = extraction.type === 'levels' ? 'vertical' : type;
    return buildDiagram(extraction.items, finalType, desc);
  }

  // No structured items extracted. Build a conceptual diagram from the description.
  const subject = extractSubject(desc);

  // Try splitting by double-dash segments
  const dashParts = desc.split(/\s*[-—–]{2,3}\s*/).filter(p => p.length > 5 && p.length < 80);
  if (dashParts.length >= 3) {
    return buildDiagram(dashParts.slice(0, 6), type, desc);
  }

  // Try splitting at natural clause boundaries
  const segments = desc
    .split(/\s*(?:,\s+(?:with|where|and then|then|which|producing|resulting in|leading to|followed by|compared to|alongside)\s+|;\s+)/i)
    .map(seg => seg.trim())
    .filter(seg => seg.length > 5 && seg.length < 80)
    .slice(0, 6);

  if (segments.length >= 2) {
    return buildDiagram(segments, type, desc);
  }

  // Try splitting by commas more aggressively
  const commaParts = desc
    .split(/,\s*/)
    .map(seg => seg.trim())
    .filter(seg => seg.length > 5 && seg.length < 60)
    .slice(0, 6);

  if (commaParts.length >= 3) {
    return buildDiagram(commaParts, type, desc);
  }

  // Try "X at/on/in the top/left/first" positional patterns
  const keyPhrases = [];
  const phrasePatterns = [
    /(?:at the top|first|primary|top)[:\s]+([^,;—–]{3,40})/gi,
    /(?:below|second|next|middle)[:\s]+([^,;—–]{3,40})/gi,
    /(?:at the (?:base|bottom)|last|final|bottom)[:\s]+([^,;—–]{3,40})/gi,
  ];
  for (const pat of phrasePatterns) {
    const m = pat.exec(desc);
    if (m) keyPhrases.push(m[1].trim());
  }
  if (keyPhrases.length >= 2) {
    return buildDiagram(keyPhrases, type, desc);
  }

  // Fallback: split the description into meaningful semantic chunks
  // by finding natural breakpoints (conjunctions, prepositional phrases)
  const chunks = desc
    .split(/\s+(?:versus|vs\.?|compared to|followed by|leading to|resulting in|flowing (?:into|to)|then|where|while|showing|illustrating|with)\s+/i)
    .map(c => c.trim())
    .filter(c => c.length > 5 && c.length < 60);

  if (chunks.length >= 2) {
    return buildDiagram(chunks.slice(0, 5), type, desc);
  }

  // Final fallback: use the subject and extract a key clause
  const afterShowing = desc.match(/(?:showing|illustrating|displaying)\s+(.+?)$/i);
  if (afterShowing) {
    const detail = afterShowing[1].trim();
    // Split the detail at the first major boundary
    const detailParts = detail.split(/\s+(?:with|where|and|then|while)\s+/i).filter(p => p.length > 3);
    if (detailParts.length >= 2) {
      return buildDiagram(detailParts.slice(0, 4), type, desc);
    }
    return buildPipeline([subject, s(detail, 45)], desc);
  }

  // Absolute last resort
  return buildPipeline([subject, s(desc.substring(Math.min(desc.length, 50)).trim(), 45)], desc);
}

// ═══ FILE PROCESSING ═══

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let changed = false;
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^\*Recommended visual:/.test(line)) {
      let fullLine = line;
      // Handle multi-line (check if closing * is present)
      const starCount = (fullLine.match(/\*/g) || []).length;
      if (starCount < 2) {
        while (i + 1 < lines.length) {
          i++;
          fullLine += ' ' + lines[i];
          if (lines[i].includes('*')) break;
        }
      }

      const desc = cleanDesc(fullLine);
      resetId();
      const mermaid = descriptionToMermaid(desc);

      newLines.push('```mermaid');
      newLines.push(mermaid);
      newLines.push('```');
      changed = true;
    } else {
      newLines.push(line);
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
  }
  return changed;
}

// ═══ RUN ═══

const files = walkFiles(CONTENT_DIR);
let totalChanged = 0;
let totalPlaceholders = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const count = (content.match(/^\*Recommended visual:/gm) || []).length;
  if (count > 0) {
    totalPlaceholders += count;
    if (processFile(file)) {
      totalChanged++;
    }
  }
}

// Quality check
let good = 0, poor = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const diagrams = [...content.matchAll(/```mermaid\n([\s\S]+?)\n```/g)];
  for (const m of diagrams) {
    const nodeCount = (m[1].match(/\["/g) || []).length + (m[1].match(/\{"/g) || []).length;
    if (nodeCount >= 3) good++;
    else poor++;
  }
}

console.log(`Converted ${totalPlaceholders} placeholders in ${totalChanged} files.`);
console.log(`Quality: ${good} good (3+ nodes), ${poor} sparse (1-2 nodes)`);
