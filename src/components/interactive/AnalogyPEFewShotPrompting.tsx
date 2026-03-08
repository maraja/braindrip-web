import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEFewShotPrompting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of training a new hire by showing them completed examples of the work. Instead of describing the company\'s report format in abstract terms, you hand them three finished reports and say: "Write one like these for this new client." They immediately see the structure, tone, level of detail, and formatting conventions.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The examples you choose determine few-shot effectiveness. Key selection principles:  Diversity over quantity: 5 diverse examples outperform 8 similar ones. Select examples that cover different input types, edge cases, and output variations.' },
    { emoji: '🔍', label: 'In Detail', text: 'Few-shot prompting provides a small number of input-output examples (typically 3-8) in the prompt before presenting the actual task input. The model uses in-context learning (ICL) to identify the pattern from these examples and apply it to the new input.' },
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
