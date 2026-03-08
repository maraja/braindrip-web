import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyADPCostLatencyOptimization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a restaurant kitchen. The head chef manages three competing pressures: ingredient cost, food quality, and service speed. You can use premium ingredients and serve quickly, but the bill goes up. You can use cheap ingredients and cook slowly with care, but customers wait. You can be fast and cheap, but quality drops.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Every design decision in an agent system trades off between these three dimensions. The first step is defining your constraints. Step 1: Define your quality floor.' },
    { emoji: '🔍', label: 'In Detail', text: 'Agent systems face the same three-way tension. Every LLM call has a token cost, a latency cost, and a quality contribution. A 10-step agent workflow using a frontier model might cost 0.50 and take 45 seconds but achieve 92% task success. The same workflow with a smaller model might cost 0.02 and take 8 seconds but achieve only 71% success.' },
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
