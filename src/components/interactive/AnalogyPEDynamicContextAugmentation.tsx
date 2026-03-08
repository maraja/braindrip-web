import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEDynamicContextAugmentation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of dynamic context augmentation like a student who looks things up as they study rather than gathering all materials upfront. Instead of photocopying every potentially relevant chapter before sitting down to write an essay, the student reads the assignment, starts researching, realizes they need more detail on a specific point, looks that.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The model evaluates its confidence in answering based on available context and triggers additional retrieval when confidence is low:  Explicit confidence assessment: The prompt instructs the model to assess whether it has sufficient information before generating a final answer.' },
    { emoji: '🔍', label: 'In Detail', text: 'Dynamic context augmentation is the runtime process of deciding when, what, and how much additional context to fetch during generation. Unlike static RAG (retrieve once, generate once), dynamic augmentation treats retrieval as an iterative, adaptive process.' },
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
