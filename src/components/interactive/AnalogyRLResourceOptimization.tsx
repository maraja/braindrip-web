import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLResourceOptimization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine managing a building\'s heating and cooling system. You could follow fixed rules ("if temperature exceeds 72F, turn on AC"), but these rules ignore the complex interactions between weather forecasts, occupancy patterns, electricity prices, equipment wear, and thermal inertia.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Google\'s data center cooling optimization (Evans & Gao, 2016) is perhaps the most celebrated industrial RL application:  Problem: Data centers consume enormous energy for cooling (~40% of total). The cooling system has hundreds of interacting parameters: chiller set points, cooling tower fans, pump speeds, air handler configurations.' },
    { emoji: '🔍', label: 'In Detail', text: 'Resource optimization problems share common traits: high-dimensional state spaces, complex dynamics, sequential decisions with delayed consequences, and well-defined objectives.' },
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
