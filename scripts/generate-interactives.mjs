/**
 * Generate Quiz, Analogy, and Scale interactive components for all non-llm-concepts courses.
 *
 * Reads each markdown file, extracts content from key sections, and generates
 * three React components per concept:
 *   - Quiz: 3 True/False questions from Key Technical Details + Common Misconceptions
 *   - Analogy: 3 metaphors derived from the "What Is..." section
 *   - Scale: Real-world impact question from "Why It Matters"
 *
 * Also generates:
 *   - Registry entries for interactive-registry.mjs
 *   - Lazy imports for InteractiveHydrator.tsx
 */

import fs from 'fs';
import path from 'path';

const COURSES_DIR = path.resolve('src/content/courses');
const COMPONENTS_DIR = path.resolve('src/components/interactive');

// Utility: slug to PascalCase
function toPascalCase(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

// Utility: course-aware component name prefix
function componentPrefix(courseSlug, conceptSlug) {
  // Short course prefix to keep names manageable
  const courseMap = {
    'ai-agent-concepts': 'AAC',
    'ai-agent-evaluation': 'AAE',
    'agentic-design-patterns': 'ADP',
    'computer-vision-concepts': 'CVC',
    'langgraph-agents': 'LGA',
    'llm-evolution': 'LLE',
    'machine-learning-foundations': 'MLF',
    'mcp-server-supabase-course': 'MCP',
    'natural-language-processing': 'NLP',
    'prompt-engineering': 'PE',
    'reinforcement-learning': 'RL',
  };
  return courseMap[courseSlug] || toPascalCase(courseSlug);
}

// Extract section text between two h2s
function extractSection(content, sectionName) {
  // Match exact h2 or startsWith
  const lines = content.split('\n');
  let capturing = false;
  let result = [];
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (capturing) break;
      if (line.replace('## ', '').trim().startsWith(sectionName) || line.replace('## ', '').trim() === sectionName) {
        capturing = true;
        continue;
      }
    }
    if (capturing) result.push(line);
  }
  return result.join('\n').trim();
}

// Extract title from first # heading
function extractTitle(content) {
  const match = content.match(/^# (.+)$/m);
  return match ? match[1].trim() : '';
}

// Extract one-line summary
function extractSummary(content) {
  const match = content.match(/\*\*One-Line Summary\*\*:\s*(.+)/);
  return match ? match[1].trim() : '';
}

// Clean markdown to plain text (rough)
function stripMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^[-*] /gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/^\d+\.\s*/gm, '')
    .trim();
}

// Escape string for JS template in JSX context
function escapeJs(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

// Get key facts from a section (first N non-empty bullet points or sentences)
function getKeyFacts(sectionText, count = 6) {
  const stripped = stripMd(sectionText);
  const sentences = stripped.split(/(?<=[.!?])\s+/).filter(s => s.length > 20 && s.length < 300);
  return sentences.slice(0, count);
}

// Generate quiz questions from content
function generateQuiz(title, techDetails, misconceptions, summary) {
  const questions = [];

  // Extract misconceptions as false statements
  const miscLines = misconceptions.split('\n').filter(l => l.trim().length > 0);
  for (const line of miscLines) {
    const stripped = stripMd(line);
    // Look for misconception pattern: "X is/does Y" -> false
    const match = stripped.match(/(?:misconception|myth|wrong|incorrect|not true|false that|actually|contrary)/i);
    if (match && stripped.length > 30 && stripped.length < 250) {
      // Try to extract the misconception itself
      const misconMatch = stripped.match(/(?:"([^"]+)"|that (.+?)(?:\.|$))/);
      if (misconMatch) {
        const miscText = misconMatch[1] || misconMatch[2];
        if (miscText && miscText.length > 15) {
          questions.push({
            text: miscText.charAt(0).toUpperCase() + miscText.slice(1),
            isTrue: false,
            explanation: stripped.slice(0, 200),
          });
        }
      }
    }
  }

  // Extract true facts from technical details
  const facts = getKeyFacts(techDetails, 8);
  for (const fact of facts) {
    if (fact.length > 20 && fact.length < 200 && !fact.includes('?')) {
      questions.push({
        text: fact,
        isTrue: true,
        explanation: 'This is a key technical detail of ' + title + '.',
      });
    }
  }

  // If we don't have enough, use summary
  if (questions.length < 3 && summary) {
    questions.push({
      text: summary,
      isTrue: true,
      explanation: 'This captures the core purpose of ' + title + '.',
    });
  }

  // Return exactly 3, padding with generic if needed
  while (questions.length < 3) {
    questions.push({
      text: title + ' is a fundamental concept in this domain.',
      isTrue: true,
      explanation: 'Understanding ' + title + ' is important for building on more advanced topics.',
    });
  }

  return questions.slice(0, 3);
}

// Generate analogies from content
function generateAnalogies(title, whatSection, summary) {
  const analogyTemplates = [
    { emoji: '🏗', label: 'Building', makeText: (t, s) => `Think of ${t} like constructing a building. ${s} Just as a builder follows blueprints to create a structure, this concept provides the foundational framework that everything else builds upon.` },
    { emoji: '🎭', label: 'Theater', makeText: (t, s) => `${t} is like directing a theater production. ${s} Each element plays a specific role, and the overall performance depends on how well they work together.` },
    { emoji: '🗺', label: 'Navigation', makeText: (t, s) => `Think of ${t} like navigating with a map. ${s} You need to understand where you are, where you want to go, and the best route to get there.` },
  ];

  // Try to get the first paragraph of the What section
  const firstPara = stripMd(whatSection.split('\n\n')[0] || summary || '');
  const shortPara = firstPara.length > 150 ? firstPara.slice(0, 147) + '...' : firstPara;

  return analogyTemplates.map(t => ({
    emoji: t.emoji,
    label: t.label,
    text: t.makeText(title, shortPara),
  }));
}

// Generate scale/impact content
function generateScale(title, whyMatters, summary) {
  const text = stripMd(whyMatters || summary || '');
  const firstSentences = text.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');

  const question = `Understanding ${title} has real implications for how AI systems are built and deployed. What makes this concept especially important in practice?`;
  const answer = firstSentences.length > 30
    ? firstSentences.slice(0, 300)
    : `${title} is a key building block that directly impacts the performance, reliability, and safety of modern AI systems.`;

  return { question, answer };
}

// Generate component file content
function generateQuizComponent(name, questions) {
  const qs = questions.map(q => `    { text: '${escapeJs(q.text)}', isTrue: ${q.isTrue}, explanation: '${escapeJs(q.explanation)}' }`).join(',\n');
  return `import { useState } from 'react';
export default function ${name}() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
${qs},
  ];
  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '1.5rem', margin: '2rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#C76B4A', fontWeight: 600 }}>&#10022;</span>
        <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: '1rem', fontWeight: 600, color: '#2C3E2D' }}>Quick Check</span>
        <span style={{ fontSize: '0.7rem', color: '#8BA888', fontFamily: "'JetBrains Mono', monospace", marginLeft: 'auto' }}>
          {Object.keys(answers).length}/{questions.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {questions.map((q, i) => (
          <div key={i} style={{ background: answers[i] !== undefined ? (answers[i] === q.isTrue ? '#f0f7f0' : '#fdf0ed') : '#F0EBE1', borderRadius: '10px', padding: '0.875rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#2C3E2D', margin: 0, lineHeight: 1.5 }}>{q.text}</p>
            {answers[i] === undefined ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button onClick={() => setAnswers(a => ({ ...a, [i]: true }))} style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'white', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D' }}>True</button>
                <button onClick={() => setAnswers(a => ({ ...a, [i]: false }))} style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'white', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D' }}>False</button>
              </div>
            ) : (
              <p style={{ fontSize: '0.78rem', color: answers[i] === q.isTrue ? '#4a7c59' : '#C76B4A', marginTop: '0.375rem', marginBottom: 0, lineHeight: 1.4 }}>
                {answers[i] === q.isTrue ? '\\u2713 ' : '\\u2717 '}{q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
`;
}

function generateAnalogyComponent(name, analogies) {
  const as = analogies.map(a => `    { emoji: '${a.emoji}', label: '${escapeJs(a.label)}', text: '${escapeJs(a.text)}' }`).join(',\n');
  return `import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function ${name}() {
  const [idx, setIdx] = useState(0);
  const analogies = [
${as},
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\\u2726 THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
`;
}

function generateScaleComponent(name, scale) {
  return `import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function ${name}() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\\u26A1 REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>${escapeJs(scale.question)}</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact \\u2192
        </button>
      ) : (
        <div style={{ padding: '0.75rem 1rem', background: '#C76B4A' + '0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
          <p style={{ fontSize: '0.9rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>${escapeJs(scale.answer)}</p>
        </div>
      )}
    </div>
  );
}
`;
}

// Main
const allCourses = fs.readdirSync(COURSES_DIR).filter(d =>
  d !== 'llm-concepts' && fs.statSync(path.join(COURSES_DIR, d)).isDirectory()
);

const registryEntries = {};
const hydratorImports = [];
let componentCount = 0;

for (const courseSlug of allCourses) {
  const courseDir = path.join(COURSES_DIR, courseSlug);
  const moduleDirs = fs.readdirSync(courseDir).filter(d =>
    fs.statSync(path.join(courseDir, d)).isDirectory()
  ).sort();

  for (const moduleDir of moduleDirs) {
    const modPath = path.join(courseDir, moduleDir);
    const files = fs.readdirSync(modPath).filter(f => f.endsWith('.md')).sort();

    for (const file of files) {
      const conceptSlug = file.replace('.md', '');
      const prefix = componentPrefix(courseSlug, conceptSlug);
      const pascal = toPascalCase(conceptSlug);

      const quizName = `Quiz${prefix}${pascal}`;
      const analogyName = `Analogy${prefix}${pascal}`;
      const scaleName = `Scale${prefix}${pascal}`;

      // Read content
      const content = fs.readFileSync(path.join(modPath, file), 'utf-8');
      const title = extractTitle(content) || conceptSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const summary = extractSummary(content);

      // Extract sections
      const whatSection = extractSection(content, 'What');
      const howSection = extractSection(content, 'How It Works');
      const whySection = extractSection(content, 'Why It Matters');
      const techSection = extractSection(content, 'Key Technical Details');
      const miscSection = extractSection(content, 'Common Misconceptions');

      // Generate content
      const quizQuestions = generateQuiz(title, techSection, miscSection, summary);
      const analogies = generateAnalogies(title, whatSection, summary);
      const scale = generateScale(title, whySection, summary);

      // Write components
      fs.writeFileSync(path.join(COMPONENTS_DIR, `${quizName}.tsx`), generateQuizComponent(quizName, quizQuestions));
      fs.writeFileSync(path.join(COMPONENTS_DIR, `${analogyName}.tsx`), generateAnalogyComponent(analogyName, analogies));
      fs.writeFileSync(path.join(COMPONENTS_DIR, `${scaleName}.tsx`), generateScaleComponent(scaleName, scale));

      componentCount += 3;

      // Registry entry — use composite key to avoid cross-course collisions
      const registryKey = `${courseSlug}/${conceptSlug}`;
      registryEntries[registryKey] = registryEntries[registryKey] || [];
      registryEntries[registryKey].push(
        { component: quizName, afterSection: 'Common Misconceptions' },
        { component: analogyName, afterSectionStartsWith: 'What' },
        { component: scaleName, afterSection: 'Why It Matters' },
      );

      // Hydrator imports
      hydratorImports.push(
        `  ${quizName}: lazy(() => import('./${quizName}')),`,
        `  ${analogyName}: lazy(() => import('./${analogyName}')),`,
        `  ${scaleName}: lazy(() => import('./${scaleName}')),`,
      );
    }
  }
}

// Output registry additions
const registryAdditions = Object.entries(registryEntries)
  .map(([slug, items]) => {
    const entries = items.map(i => {
      if (i.afterSectionStartsWith) {
        return `    { component: '${i.component}', afterSectionStartsWith: '${i.afterSectionStartsWith}' }`;
      }
      return `    { component: '${i.component}', afterSection: '${i.afterSection}' }`;
    }).join(',\n');
    return `  '${slug}': [\n${entries},\n  ]`;
  })
  .join(',\n');

fs.writeFileSync('scripts/registry-additions.txt', registryAdditions);
fs.writeFileSync('scripts/hydrator-additions.txt', hydratorImports.join('\n'));

console.log(`Generated ${componentCount} components for ${Object.keys(registryEntries).length} concepts across ${allCourses.length} courses`);
console.log('Registry additions saved to scripts/registry-additions.txt');
console.log('Hydrator additions saved to scripts/hydrator-additions.txt');
