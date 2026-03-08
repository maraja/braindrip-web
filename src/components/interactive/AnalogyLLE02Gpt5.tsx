import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE02Gpt5() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a skilled professional who doesn\'t need to be told whether to think quickly or carefully — they automatically calibrate their effort to the difficulty of the problem. Ask them what time it is, and they glance at a clock.' },
    { emoji: '⚙️', label: 'How It Works', text: 'GPT-5\'s defining architectural innovation is its internal complexity router. Rather than maintaining separate model weights for "fast" and "reasoning" modes, GPT-5 uses a single set of weights with a learned routing mechanism that dynamically allocates inference compute. Simple factual queries receive minimal chain-of-thought processing.' },
    { emoji: '🔍', label: 'In Detail', text: 'GPT-5 represents the resolution of a product tension that had been building inside OpenAI since late 2024. The GPT line (GPT-4, GPT-4o) optimized for fast, fluent, multimodal responses. The o-series (o1, o3) optimized for deep reasoning through explicit chain-of-thought at inference time.' },
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
