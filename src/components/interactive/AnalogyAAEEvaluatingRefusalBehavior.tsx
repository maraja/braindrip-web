import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEEvaluatingRefusalBehavior() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a pharmacist who must decide when to fill a prescription and when to refuse. Refuse too readily -- declining valid prescriptions because the dosage looks unusual -- and patients go without needed medication. Refuse too rarely -- filling every prescription without question -- and dangerous drug interactions go unchecked.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Over-refusal occurs when an agent declines safe, legitimate requests. This is the most common user-facing complaint about safety-tuned agents and one of the hardest problems to evaluate because it requires determining ground truth for whether a request was actually safe.' },
    { emoji: '🔍', label: 'In Detail', text: 'Agent refusal behavior operates on the same spectrum. An agent that refuses everything risky is safe but useless. An agent that accepts everything is useful but dangerous. The goal is calibrated refusal: the agent\'s refusal rate should match the actual risk level of requests, it should decline genuinely harmful requests while accepting legitimate.' },
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
