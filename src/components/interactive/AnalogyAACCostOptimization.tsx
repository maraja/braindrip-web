import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACCostOptimization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Running an agent is like running a taxi service where the meter ticks for every second of thinking, every mile of tool calls, and every passenger interaction. A single agent task might require 10-50 LLM calls, each consuming thousands of tokens at 3-15 per million tokens.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Model routing assigns each agent step to the cheapest model capable of handling it. A classification step (is this a billing question or a technical question?) does not need GPT-4o -- GPT-4o-mini or Claude Haiku handles it at 1/20th the cost with comparable accuracy.' },
    { emoji: '🔍', label: 'In Detail', text: 'The fundamental tension in agent cost optimization is quality versus cost. The most capable models (Claude Opus, GPT-4o) produce the best results but cost 10-30x more per token than smaller models (Claude Haiku, GPT-4o-mini). Longer, more detailed prompts improve output quality but consume more tokens.' },
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
