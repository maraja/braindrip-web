import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPNaturalLanguageInference() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you overhear someone say, "All the restaurants on Main Street are closed today." Now consider three follow-up statements: (1) "There is no place to eat on Main Street today" -- this follows logically from what you heard (entailment).' },
    { emoji: '⚙️', label: 'How It Works', text: 'The Stanford Natural Language Inference corpus (Bowman et al., 2015) was a watershed moment for NLI research. Previous textual entailment datasets contained hundreds to low thousands of examples -- too few for data-hungry neural models. SNLI provided 570,152 human-written premise-hypothesis pairs with three-way labels.' },
    { emoji: '🔍', label: 'In Detail', text: 'NLI evolved from the textual entailment task (see textual-entailment.md), expanding from binary entailment/non-entailment to the more informative three-way classification. The term "natural language inference" became dominant with the release of large-scale datasets -- particularly SNLI and MultiNLI -- that enabled neural approaches requiring.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u2726 KEY PERSPECTIVES</p>
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
