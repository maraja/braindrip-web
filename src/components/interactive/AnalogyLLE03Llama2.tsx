import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE03Llama2() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a company that inadvertently started a revolution. Their research prototype leaked, was modified by thousands of people, and spawned an entire ecosystem outside their control. Now the company faces a choice: try to shut it down, or lean into it and lead the movement officially. Meta chose the second path.' },
    { emoji: '⚙️', label: 'How It Works', text: 'LLaMA 2 was trained on 2 trillion tokens — a 40% increase over LLaMA 1\'s 1.0-1.4 trillion. The training corpus was drawn from publicly available sources, though Meta did not disclose the exact mixture.' },
    { emoji: '🔍', label: 'In Detail', text: 'LLaMA 2 was Meta\'s deliberate, strategic embrace of open AI — not a research artifact that escaped, but a fully supported product released with a commercial license, safety documentation, and corporate partnerships.' },
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
