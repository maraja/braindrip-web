import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE02DeepseekV3() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'If DeepSeek V2 demonstrated that architectural innovation could reduce inference costs, V3 proved the same principle applied to training. Released on December 26, 2024, DeepSeek V3 was a 671 billion parameter mixture-of-experts model that achieved frontier-level performance on a training budget of $5.' },
    { emoji: '⚙️', label: 'How It Works', text: 'V3 was the first large-scale model trained primarily in FP8 (8-bit floating point) rather than the industry standard BF16 (16-bit brain floating point). FP8 halves the memory required per parameter and doubles the computational throughput on compatible hardware (NVIDIA H800 GPUs with FP8 tensor cores).' },
    { emoji: '🔍', label: 'In Detail', text: 'The model was also notable for what it was trained on and how: 14.8 trillion tokens, processed primarily in 8-bit floating point (FP8) precision, a first at this scale. Where others threw more GPUs at the problem, DeepSeek threw better engineering.' },
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
