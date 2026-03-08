import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE05Qwen3CoderAndSpecialization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you hire a general contractor who can do plumbing, electrical, carpentry, and painting reasonably well. Now imagine you hire a specialist electrician who has spent years focused exclusively on electrical work. For complex wiring, the specialist outperforms the generalist even if the generalist has more overall experience.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Qwen3-Coder\'s training followed a three-stage pipeline that has become the template for domain specialization:  Stage 1 — Code Pre-training: Starting from the general Qwen 3 base weights, the model underwent extended pre-training on a massive corpus of code.' },
    { emoji: '🔍', label: 'In Detail', text: 'Qwen3-Coder, released by Alibaba Cloud in July 2025, is a 480B total / 35B active MoE model purpose-built for coding tasks. It was not trained from scratch as a code model but rather built on the Qwen 3 general foundation through an extended pipeline of code-specific pre-training, supervised fine-tuning on coding tasks, and reinforcement learning.' },
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
