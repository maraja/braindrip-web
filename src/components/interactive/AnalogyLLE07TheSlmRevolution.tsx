import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE07TheSlmRevolution() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider the history of commercial aviation. Early jets were enormous -- the Boeing 747 was the future, and bigger meant better. Then came a quiet revolution: the Boeing 737, the Airbus A320, and their successors. These smaller aircraft couldn\'t cross oceans nonstop, but they could serve thousands of routes that jumbo jets never could.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The case for SLMs isn\'t theoretical -- it\'s backed by benchmark data that repeatedly shows small models competing with those many times their size:  Phi-2 (2.7B) matched LLaMA-2-70B (25x larger) on multi-step reasoning benchmarks Mistral-7B outperformed LLaMA-2-13B on every benchmark despite being nearly half the size Gemma 3-27B reached quality.' },
    { emoji: '🔍', label: 'In Detail', text: 'The SLM (Small Language Model) revolution follows the same trajectory. From 2020 to early 2023, the dominant narrative in AI was relentlessly scaling up: GPT-3 at 175B, PaLM at 540B, speculative estimates of GPT-4 at over 1 trillion parameters.' },
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
