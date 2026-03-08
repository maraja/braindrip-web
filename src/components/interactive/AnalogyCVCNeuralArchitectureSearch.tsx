import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCNeuralArchitectureSearch() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are an architect designing a building. You know the materials available (types of layers), the constraints (budget, building codes), and the goal (maximize usable space). Traditionally, expert architects draw on years of experience to make design choices.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Every NAS method defines three things:  Search space: The set of possible architectures. This includes the types of operations (convolutions, pooling, skip connections), how they can be connected, and any structural constraints.' },
    { emoji: '🔍', label: 'In Detail', text: 'Neural Architecture Search was popularized by Zoph and Le (2017) at Google Brain, who used a recurrent neural network controller trained with reinforcement learning to generate CNN architectures. The approach discovered architectures that matched or exceeded human-designed networks, but at extraordinary computational cost -- 800 GPUs for 28 days.' },
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
