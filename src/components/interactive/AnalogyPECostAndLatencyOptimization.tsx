import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPECostAndLatencyOptimization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of optimizing an LLM application like planning a shipping route. You want packages delivered fast (low latency) and cheaply (low cost), but the fastest route is rarely the cheapest. A direct flight is fast but expensive; ground shipping is cheap but slow.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest optimization is reducing prompt length. Ablation studies (see prompt-optimization-techniques.md) often reveal that 20-30% of prompt tokens contribute negligibly to output quality.' },
    { emoji: '🔍', label: 'In Detail', text: 'The economics of LLM applications are dominated by token costs. A production application serving 1 million requests per day with an average prompt of 2,000 tokens and 500 output tokens at GPT-4-class pricing (10 per million input tokens, 30 per million output tokens) costs roughly 35,000 per month.' },
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
