import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEInformationPriorityAndOrdering() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of writing a newspaper article. Journalists use the "inverted pyramid" structure: the most important facts go in the first paragraph, supporting details follow, and background information fills the end. Editors cut articles from the bottom, so critical information is never lost regardless of how much gets trimmed.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The attention pattern across the context window forms a U-shape:  Beginning (first 10-20% of tokens): Highest attention. System prompts, critical instructions, and role definitions placed here are most reliably followed. Middle (20-80% of tokens): Lowest attention.' },
    { emoji: '🔍', label: 'In Detail', text: 'LLMs exhibit similar attention patterns, but with a twist. Research has revealed a U-shaped attention curve: models attend strongly to information at the beginning of the context (primacy effect), attend strongly to information at the end (recency effect), and lose track of information in the middle.' },
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
