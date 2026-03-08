/**
 * Generate Quiz, Analogy, and Scale interactive components for all non-llm-concepts courses.
 *
 * Reads each markdown file, extracts content from key sections, and generates
 * up to five React components per concept:
 *   - Quiz: True/False questions from Key Technical Details + Common Misconceptions
 *   - Analogy: Key perspectives derived from the "What Is..." section
 *   - Scale: Real-world impact from "Why It Matters" subsections
 *   - Walkthrough: Step-by-step guide from "How It Works" subsections
 *   - Explorer: Expandable key details from "Key Technical Details"
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

// Extract subsections (h3s) from a section
function extractSubsections(sectionText) {
  const subsections = [];
  const lines = sectionText.split('\n');
  let currentTitle = null;
  let currentContent = [];

  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (currentTitle) {
        subsections.push({ title: currentTitle, content: currentContent.join('\n').trim() });
      }
      currentTitle = line.replace('### ', '').trim();
      currentContent = [];
    } else if (currentTitle) {
      currentContent.push(line);
    }
  }
  if (currentTitle) {
    subsections.push({ title: currentTitle, content: currentContent.join('\n').trim() });
  }
  return subsections;
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
    .replace(/```[\s\S]*?```/g, '')  // Remove code blocks first
    .replace(/\|[^\n]+\|/g, '')  // Remove table rows
    .replace(/^[-|: ]+$/gm, '')  // Remove table separators
    .replace(/^### .+$/gm, '')  // Remove h3 headings
    .replace(/^## .+$/gm, '')   // Remove h2 headings
    .replace(/\*Recommended visual:.*$/gm, '')  // Remove visual recommendations
    .replace(/\$\$[\s\S]*?\$\$/g, '[equation]')  // Remove display math
    .replace(/\$([^$]+)\$/g, '$1')  // Inline math: keep content without $
    .replace(/\\times/g, 'x')  // LaTeX multiplication
    .replace(/\\(?:text|mathrm|mathbf)\{([^}]+)\}/g, '$1')  // LaTeX text commands
    .replace(/\\[a-zA-Z]+/g, '')  // Remove other LaTeX commands
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^[-*] /gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/^\d+\.\s*/gm, '')
    .replace(/\n{3,}/g, '\n\n')
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

// Truncate text at a sentence boundary near maxLen
function truncateAtSentence(text, maxLen) {
  if (text.length <= maxLen) return text;
  // Find the last sentence-ending punctuation before maxLen
  const truncated = text.slice(0, maxLen);
  const lastSentence = truncated.search(/[.!?][^.!?]*$/);
  if (lastSentence > maxLen * 0.5) {
    return truncated.slice(0, lastSentence + 1);
  }
  // Fallback: truncate at last space
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '.' : truncated + '.';
}

// Get key facts from a section (first N non-empty sentences)
function getKeyFacts(sectionText, count = 8) {
  const stripped = stripMd(sectionText);
  const sentences = stripped.split(/(?<=[.!?])\s+/).filter(s => s.length > 20 && s.length < 300);
  return sentences.slice(0, count);
}

// Extract paragraphs from text (non-empty, substantial)
function extractParagraphs(text) {
  const stripped = stripMd(text);
  return stripped.split('\n\n').map(p => p.trim()).filter(p => p.length > 40);
}

// Generate quiz questions from content
function generateQuiz(title, techDetails, misconceptions, summary) {
  const questions = [];

  // Extract misconceptions as false statements with their explanations
  if (misconceptions) {
    const paragraphs = misconceptions.split(/\n\n+/).filter(p => p.trim().length > 0);
    for (const para of paragraphs) {
      const stripped = stripMd(para).trim();
      // Look for quoted misconception pattern: "misconception text"
      const quoteMatch = stripped.match(/^"([^"]+)"/);
      if (quoteMatch && quoteMatch[1].length > 15 && quoteMatch[1].length < 200) {
        // The rest of the paragraph is the explanation
        const explanation = stripped.slice(quoteMatch[0].length).trim();
        const shortExplanation = explanation.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');
        questions.push({
          text: quoteMatch[1],
          isTrue: false,
          explanation: shortExplanation.length > 20 ? shortExplanation : 'This is a common misconception. ' + explanation.slice(0, 150),
        });
      }
    }
  }

  // Extract true facts from technical details with context
  if (techDetails) {
    const bulletPoints = techDetails.split('\n').filter(l => l.trim().startsWith('- **') || l.trim().startsWith('* **'));
    for (const bp of bulletPoints) {
      const stripped = stripMd(bp).trim();
      // Split on colon to get the fact and its explanation
      const colonIdx = stripped.indexOf(':');
      if (colonIdx > 5 && colonIdx < stripped.length - 20) {
        const factPart = stripped.slice(colonIdx + 1).trim();
        const factSentence = factPart.split(/(?<=[.!?])\s+/)[0];
        if (factSentence && factSentence.length > 20 && factSentence.length < 200 && !factSentence.includes('?')) {
          const remainingExplanation = factPart.slice(factSentence.length).trim();
          questions.push({
            text: factSentence,
            isTrue: true,
            explanation: remainingExplanation.length > 20
              ? remainingExplanation.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ')
              : factSentence,
          });
        }
      }
    }
  }

  // Ensure variety: at most 3 true, at most 3 false
  const falseQs = questions.filter(q => !q.isTrue);
  const trueQs = questions.filter(q => q.isTrue);
  const balanced = [];
  // Interleave: false, true, false, true...
  const maxPairs = Math.min(Math.max(falseQs.length, trueQs.length), 3);
  for (let i = 0; i < maxPairs; i++) {
    if (i < falseQs.length) balanced.push(falseQs[i]);
    if (i < trueQs.length) balanced.push(trueQs[i]);
  }

  // If we still need more, add from whichever has more
  if (balanced.length < 3) {
    const remaining = questions.filter(q => !balanced.includes(q));
    while (balanced.length < 3 && remaining.length > 0) {
      balanced.push(remaining.shift());
    }
  }

  // Fallback if still not enough
  if (balanced.length < 3 && summary) {
    balanced.push({
      text: stripMd(summary),
      isTrue: true,
      explanation: 'This captures the core definition of ' + title + '.',
    });
  }

  while (balanced.length < 3) {
    balanced.push({
      text: title + ' is a fundamental concept in this domain.',
      isTrue: true,
      explanation: 'Understanding ' + title + ' is important for building on more advanced topics.',
    });
  }

  return balanced.slice(0, 5);
}

// Generate perspective-based analogies from content
function generateAnalogies(title, whatSection, howSection, summary) {
  const perspectives = [];

  // Extract meaningful paragraphs from the "What Is" section
  const whatParas = extractParagraphs(whatSection);
  const howSubsections = extractSubsections(howSection);

  // Perspective 1: Core concept from first paragraph of What section
  if (whatParas.length > 0) {
    const firstPara = whatParas[0];
    const text = truncateAtSentence(firstPara, 350);
    perspectives.push({
      emoji: '\u{1F4A1}',
      label: 'Core Idea',
      text,
    });
  }

  // Perspective 2: How it works (from first subsection or paragraph)
  if (howSubsections.length > 0) {
    const firstSub = howSubsections[0];
    const stripped = stripMd(firstSub.content);
    const sentences = stripped.split(/(?<=[.!?])\s+/).filter(s => s.length > 15);
    const text = truncateAtSentence(sentences.slice(0, 3).join(' '), 350);
    if (text.length > 30) {
      perspectives.push({
        emoji: '\u{2699}\u{FE0F}',
        label: 'How It Works',
        text,
      });
    }
  }

  // Perspective 3: Additional detail from a later paragraph
  if (whatParas.length > 1) {
    const laterPara = whatParas[1];
    const text = truncateAtSentence(laterPara, 350);
    perspectives.push({
      emoji: '\u{1F50D}',
      label: 'In Detail',
      text,
    });
  } else if (howSubsections.length > 1) {
    const secondSub = howSubsections[1];
    const stripped = stripMd(secondSub.content);
    const sentences = stripped.split(/(?<=[.!?])\s+/).filter(s => s.length > 15);
    const text = truncateAtSentence(sentences.slice(0, 3).join(' '), 350);
    if (text.length > 30) {
      perspectives.push({
        emoji: '\u{1F50D}',
        label: secondSub.title,
        text,
      });
    }
  }

  // Fallback: use summary if we don't have enough
  if (perspectives.length < 2 && summary) {
    perspectives.push({
      emoji: '\u{1F4CB}',
      label: 'Summary',
      text: stripMd(summary),
    });
  }

  // Ensure at least 2 perspectives
  while (perspectives.length < 2) {
    perspectives.push({
      emoji: '\u{1F4DA}',
      label: 'Overview',
      text: title + ' is an important concept to understand in this domain.',
    });
  }

  return perspectives.slice(0, 3);
}

// Generate scale/impact content with subsections
function generateScale(title, whyMatters, summary) {
  const question = `How does ${title} matter in practice?`;
  const subsections = extractSubsections(whyMatters);
  const impacts = [];

  if (subsections.length > 0) {
    // Use actual subsections from "Why It Matters"
    for (const sub of subsections.slice(0, 3)) {
      const stripped = stripMd(sub.content);
      const sentences = stripped.split(/(?<=[.!?])\s+/).filter(s => s.length > 15);
      const text = sentences.slice(0, 2).join(' ');
      if (text.length > 20) {
        impacts.push({ label: sub.title, text });
      }
    }
  }

  // Fallback: extract from plain text
  if (impacts.length === 0) {
    const stripped = stripMd(whyMatters || summary || '');
    const sentences = stripped.split(/(?<=[.!?])\s+/).filter(s => s.length > 20 && s.length < 300);
    if (sentences.length > 0) {
      impacts.push({ label: 'Key Impact', text: sentences.slice(0, 2).join(' ') });
    }
  }

  if (impacts.length === 0) {
    impacts.push({ label: 'Key Impact', text: `${title} is a key building block that directly impacts the performance, reliability, and safety of modern AI systems.` });
  }

  return { question, impacts };
}

// Generate walkthrough steps from "How It Works" section
function generateWalkthrough(title, howSection) {
  const subsections = extractSubsections(howSection);
  const steps = [];

  for (let i = 0; i < subsections.length && steps.length < 6; i++) {
    const sub = subsections[i];
    const stripped = stripMd(sub.content);
    const sentences = stripped.split(/(?<=[.!?])\s+/).filter(s => s.length > 15);
    const desc = truncateAtSentence(sentences.slice(0, 2).join(' '), 300);
    if (desc.length > 20) {
      steps.push({
        title: `${steps.length + 1}. ${sub.title}`,
        desc,
      });
    }
  }

  // Fallback if no subsections found
  if (steps.length === 0) {
    const stripped = stripMd(howSection);
    const sentences = stripped.split(/(?<=[.!?])\s+/).filter(s => s.length > 15);
    for (let i = 0; i < sentences.length && steps.length < 4; i += 2) {
      const desc = sentences.slice(i, i + 2).join(' ');
      if (desc.length > 20) {
        steps.push({
          title: `${steps.length + 1}. Step ${steps.length + 1}`,
          desc: truncateAtSentence(desc, 300),
        });
      }
    }
  }

  return steps;
}

// Generate explorer details from "Key Technical Details" section
function generateExplorer(title, techSection) {
  const details = [];

  // Try to extract bullet points with bold labels
  const bulletPoints = techSection.split('\n').filter(l => l.trim().startsWith('- **') || l.trim().startsWith('* **'));
  for (const bp of bulletPoints) {
    const labelMatch = bp.match(/\*\*(.+?)\*\*[:\s]*(.+)/);
    if (labelMatch) {
      const label = labelMatch[1].trim();
      const detail = stripMd(labelMatch[2]).trim();
      if (label.length > 3 && detail.length > 15) {
        details.push({ label, detail: truncateAtSentence(detail, 300) });
      }
    }
  }

  // Fallback: use subsections
  if (details.length === 0) {
    const subsections = extractSubsections(techSection);
    for (const sub of subsections.slice(0, 6)) {
      const stripped = stripMd(sub.content);
      const sentences = stripped.split(/(?<=[.!?])\s+/).filter(s => s.length > 15);
      const detail = sentences.slice(0, 2).join(' ');
      if (detail.length > 20) {
        details.push({ label: sub.title, detail: truncateAtSentence(detail, 300) });
      }
    }
  }

  return details.slice(0, 6);
}

// Component templates

function generateWalkthroughComponent(name, title, steps) {
  const stepsStr = steps.map(s => `    { title: '${escapeJs(s.title)}', desc: '${escapeJs(s.desc)}' }`).join(',\n');
  return `import { useState } from 'react';

const STEPS = [
${stepsStr},
];

export default function ${name}() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive Walkthrough</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          ${escapeJs(title)} \\u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how ${escapeJs(title.toLowerCase())} works, one stage at a time.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem' }}>
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i <= step ? '#C76B4A' : '#E5DFD3',
            border: 'none', cursor: 'pointer', transition: 'background 0.2s ease',
          }} />
        ))}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.05rem', fontWeight: 600, color: '#2C3E2D', margin: '0 0 0.4rem 0' }}>
          {current.title}
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: 0 }}>
          {current.desc}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
          padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid #E5DFD3',
          background: step === 0 ? '#F5F0E8' : '#FDFBF7', color: step === 0 ? '#B0A898' : '#5A6B5C',
          fontSize: '0.8rem', cursor: step === 0 ? 'default' : 'pointer', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          &#8592; Previous
        </button>
        <span style={{ fontSize: '0.75rem', color: '#7A8B7C', fontFamily: "'JetBrains Mono', monospace" }}>
          {step + 1} / {STEPS.length}
        </span>
        <button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1} style={{
          padding: '0.4rem 1rem', borderRadius: '6px',
          border: \`1px solid \${step === STEPS.length - 1 ? '#E5DFD3' : '#C76B4A'}\`,
          background: step === STEPS.length - 1 ? '#F5F0E8' : 'rgba(199, 107, 74, 0.08)',
          color: step === STEPS.length - 1 ? '#B0A898' : '#C76B4A',
          fontSize: '0.8rem', fontWeight: 500, cursor: step === STEPS.length - 1 ? 'default' : 'pointer',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          Next &#8594;
        </button>
      </div>
    </div>
  );
}
`;
}

function generateExplorerComponent(name, title, details) {
  const detailsStr = details.map(d => `    { label: '${escapeJs(d.label)}', detail: '${escapeJs(d.detail)}' }`).join(',\n');
  return `import { useState } from 'react';

const DETAILS = [
${detailsStr},
];

export default function ${name}() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          ${escapeJs(title)} \\u2014 Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {DETAILS.map((d, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} style={{
            textAlign: 'left' as const, background: open === i ? '#F0EBE1' : '#FDFBF7', border: '1px solid #E5DFD3',
            borderRadius: '10px', padding: '0.875rem 1rem', cursor: 'pointer', width: '100%', transition: 'background 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.95rem', fontWeight: 600, color: '#2C3E2D' }}>
                {d.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#7A8B7C', transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                &#9654;
              </span>
            </div>
            {open === i && (
              <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: '0.5rem 0 0 0' }}>
                {d.detail}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
`;
}

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

function generateAnalogyComponent(name, perspectives) {
  const ps = perspectives.map(p => `    { emoji: '${p.emoji}', label: '${escapeJs(p.label)}', text: '${escapeJs(p.text)}' }`).join(',\n');
  return `import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function ${name}() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
${ps},
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\\u2726 KEY PERSPECTIVES</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' as const }}>
        {perspectives.map((p, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA88818' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{perspectives[idx].text}</p>
    </div>
  );
}
`;
}

function generateScaleComponent(name, scale) {
  const impactItems = scale.impacts.map(imp =>
    `          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>${escapeJs(imp.label)}:</strong> ${escapeJs(imp.text)}</p>
          </div>`
  ).join('\n');

  return `import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
${impactItems}
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
      const walkthroughName = `Walkthrough${prefix}${pascal}`;
      const explorerName = `Explorer${prefix}${pascal}`;

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
      const perspectives = generateAnalogies(title, whatSection, howSection, summary);
      const scale = generateScale(title, whySection, summary);
      const walkthroughSteps = generateWalkthrough(title, howSection);
      const explorerDetails = generateExplorer(title, techSection);

      // Write components
      fs.writeFileSync(path.join(COMPONENTS_DIR, `${quizName}.tsx`), generateQuizComponent(quizName, quizQuestions));
      fs.writeFileSync(path.join(COMPONENTS_DIR, `${analogyName}.tsx`), generateAnalogyComponent(analogyName, perspectives));
      fs.writeFileSync(path.join(COMPONENTS_DIR, `${scaleName}.tsx`), generateScaleComponent(scaleName, scale));

      componentCount += 3;

      // Registry entry
      const registryKey = `${courseSlug}/${conceptSlug}`;
      registryEntries[registryKey] = registryEntries[registryKey] || [];
      registryEntries[registryKey].push(
        { component: quizName, afterSection: 'Common Misconceptions' },
        { component: analogyName, afterSectionStartsWith: 'What' },
        { component: scaleName, afterSection: 'Why It Matters' },
      );

      // Generate walkthrough if we have steps
      if (walkthroughSteps.length >= 2) {
        fs.writeFileSync(path.join(COMPONENTS_DIR, `${walkthroughName}.tsx`), generateWalkthroughComponent(walkthroughName, title, walkthroughSteps));
        registryEntries[registryKey].push(
          { component: walkthroughName, afterSection: 'How It Works' },
        );
        hydratorImports.push(`  ${walkthroughName}: lazy(() => import('./${walkthroughName}')),`);
        componentCount++;
      }

      // Generate explorer if we have details
      if (explorerDetails.length >= 2) {
        fs.writeFileSync(path.join(COMPONENTS_DIR, `${explorerName}.tsx`), generateExplorerComponent(explorerName, title, explorerDetails));
        registryEntries[registryKey].push(
          { component: explorerName, afterSection: 'Key Technical Details' },
        );
        hydratorImports.push(`  ${explorerName}: lazy(() => import('./${explorerName}')),`);
        componentCount++;
      }

      // Hydrator imports for quiz, analogy, scale
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
