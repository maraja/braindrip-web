#!/usr/bin/env python3
"""
Generate interactive components (Walkthrough + Explorer) for all courses
that currently only have Quiz/Analogy/Scale elements.
"""

import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(BASE_DIR, 'src', 'content', 'courses')
COMPONENTS_DIR = os.path.join(BASE_DIR, 'src', 'components', 'interactive')

COURSE_PREFIXES = {
    'agentic-design-patterns': 'ADP',
    'ai-agent-concepts': 'AAC',
    'ai-agent-evaluation': 'AAE',
    'computer-vision-concepts': 'CVC',
    'langgraph-agents': 'LGA',
    'llm-evolution': 'LLE',
    'machine-learning-foundations': 'MLF',
    'mcp-server-supabase-course': 'MCP',
    'natural-language-processing': 'NLP',
    'prompt-engineering': 'PE',
    'reinforcement-learning': 'RL',
}


def slug_to_pascal(slug):
    return ''.join(word.capitalize() for word in slug.split('-'))


def js_escape(s):
    return s.replace("\\", "\\\\").replace("'", "\\'").replace('"', '\\"').replace('\n', ' ').replace('\r', '')


def extract_lecture_info(md_path):
    with open(md_path, 'r') as f:
        content = f.read()

    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else os.path.basename(md_path).replace('.md', '')

    h2_sections = re.findall(r'^##\s+(.+)$', content, re.MULTILINE)
    has_how_it_works = any('How It Works' in s for s in h2_sections)
    has_key_technical = any('Key Technical Details' in s for s in h2_sections)

    # Extract h3 headings under "How It Works"
    steps = []
    if has_how_it_works:
        match = re.search(r'## How It Works\s*\n(.*?)(?=\n## |\Z)', content, re.DOTALL)
        if match:
            h3s = re.findall(r'###\s+(.+)', match.group(1))
            for h3 in h3s[:5]:
                clean = re.sub(r'^(Step\s+)?\d+[:.]\s*', '', h3).strip()
                steps.append(clean)

    # Extract bullet points from Key Technical Details
    tech_details = []
    if has_key_technical:
        match = re.search(r'## Key Technical Details\s*\n(.*?)(?=\n## |\Z)', content, re.DOTALL)
        if match:
            bullets = re.findall(r'[-*]\s+\*\*(.+?)\*\*[:\s]*(.+?)(?:\n|$)', match.group(1))
            for label, detail in bullets[:6]:
                tech_details.append({'label': label.strip(), 'detail': detail.strip()})

    return {
        'title': title,
        'h2_sections': h2_sections,
        'has_how_it_works': has_how_it_works,
        'has_key_technical': has_key_technical,
        'steps': steps,
        'tech_details': tech_details,
    }


def generate_walkthrough(component_name, title, steps):
    """Generate a step-by-step walkthrough component using string concatenation (no f-strings with braces)."""
    clean_title = re.sub(r'^(What (?:Is|Are) (?:an? |the )?)', '', title).rstrip('?')
    clean_title_lower = clean_title.lower()

    if not steps or len(steps) < 2:
        steps = [
            'Understanding ' + clean_title,
            'Core Mechanism',
            'Processing Flow',
            'Output and Results',
        ]

    descriptions = [
        'The foundation of ' + clean_title_lower + ' begins with understanding its core input requirements and initial setup.',
        'At this stage, the key transformation occurs \u2014 the core mechanism that makes ' + clean_title_lower + ' work.',
        'The intermediate results are processed and refined through the main pipeline.',
        'The final output is produced, incorporating all previous processing stages into the result.',
        'The complete result is validated and made available for downstream use.',
    ]

    step_items = []
    for i, step in enumerate(steps[:5]):
        desc = descriptions[i] if i < len(descriptions) else 'This step handles ' + step.lower() + '.'
        step_items.append("    { title: '" + str(i+1) + ". " + js_escape(step) + "', desc: '" + js_escape(desc) + "' }")

    steps_str = ',\n'.join(step_items)

    code = """import { useState } from 'react';

const STEPS = [
""" + steps_str + """,
];

export default function """ + component_name + """() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          """ + js_escape(clean_title) + """ — Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how """ + js_escape(clean_title_lower) + """ works, one stage at a time.
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
          border: `1px solid ${step === STEPS.length - 1 ? '#E5DFD3' : '#C76B4A'}`,
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
"""
    return code


def generate_explorer(component_name, title, tech_details):
    """Generate an explorer component with expandable cards."""
    clean_title = re.sub(r'^(What (?:Is|Are) (?:an? |the )?)', '', title).rstrip('?')
    clean_title_lower = clean_title.lower()

    if not tech_details or len(tech_details) < 2:
        tech_details = [
            {'label': 'Core Mechanism', 'detail': 'The fundamental operation that makes ' + clean_title_lower + ' work in practice.'},
            {'label': 'Performance Characteristics', 'detail': 'Typical efficiency metrics and computational costs associated with ' + clean_title_lower + '.'},
            {'label': 'Trade-offs', 'detail': 'Key design trade-offs when implementing or using ' + clean_title_lower + ' in production systems.'},
            {'label': 'Common Configurations', 'detail': 'Standard parameter settings and configurations used with ' + clean_title_lower + '.'},
        ]

    detail_items = []
    for d in tech_details[:6]:
        detail_items.append("    { label: '" + js_escape(d['label']) + "', detail: '" + js_escape(d['detail']) + "' }")

    details_str = ',\n'.join(detail_items)

    code = """import { useState } from 'react';

const DETAILS = [
""" + details_str + """,
];

export default function """ + component_name + """() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          """ + js_escape(clean_title) + """ — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of """ + js_escape(clean_title_lower) + """.
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
"""
    return code


def main():
    total = 0

    for course_slug, prefix in COURSE_PREFIXES.items():
        course_dir = os.path.join(CONTENT_DIR, course_slug)
        if not os.path.exists(course_dir):
            continue

        lectures = []
        for root, dirs, files in os.walk(course_dir):
            for f in sorted(files):
                if f.endswith('.md'):
                    lectures.append(os.path.join(root, f))

        print(f"Processing {course_slug} ({len(lectures)} lectures)")

        for md_path in lectures:
            slug = os.path.basename(md_path).replace('.md', '')
            pascal_slug = slug_to_pascal(slug)

            walkthrough_name = f'Walkthrough{prefix}{pascal_slug}'
            explorer_name = f'Explorer{prefix}{pascal_slug}'

            info = extract_lecture_info(md_path)

            # Generate and write walkthrough
            walkthrough_path = os.path.join(COMPONENTS_DIR, f'{walkthrough_name}.tsx')
            code = generate_walkthrough(walkthrough_name, info['title'], info['steps'])
            with open(walkthrough_path, 'w') as f:
                f.write(code)

            # Generate and write explorer
            explorer_path = os.path.join(COMPONENTS_DIR, f'{explorer_name}.tsx')
            code = generate_explorer(explorer_name, info['title'], info['tech_details'])
            with open(explorer_path, 'w') as f:
                f.write(code)

            total += 2

    print(f"\nDone! Regenerated {total} components.")


if __name__ == '__main__':
    main()
