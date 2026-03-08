import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE04MixtureOfExpertsEvolution() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a hospital where every patient sees every specialist — the cardiologist, the neurologist, the dermatologist — regardless of their symptoms. That would be absurdly expensive and slow. A real hospital has a triage system: a router directs each patient to the 1-2 specialists most relevant to their condition.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Jacobs, Jordan, Nowlan, and Hinton introduced the Mixture of Experts concept in 1991: multiple "expert" networks, each specializing in a region of the input space, combined through a gating network that decides which experts to use. For decades, this remained a niche technique, applied mostly to small-scale problems.' },
    { emoji: '🔍', label: 'In Detail', text: 'The core trade-off that MoE exploits is the difference between total parameters and active parameters. A 671B-parameter MoE model like DeepSeek V3 activates only 37B parameters per token — achieving the quality of a massive model at the inference cost of a much smaller one.' },
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
