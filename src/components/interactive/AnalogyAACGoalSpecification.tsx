import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACGoalSpecification() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider hiring a contractor to renovate your kitchen. If you say "make it look nice," you will get something that reflects the contractor\'s taste, not yours. If you provide detailed blueprints, material specifications, and reference photos, you will get something close to what you envisioned.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Goal specification is not a single input but a layered system, with each layer adding specificity:  Layer 1: System Prompt (Identity and Constraints) The system prompt defines who the agent is and how it should behave. It establishes: The agent\'s role ("You are an expert software engineer...' },
    { emoji: '🔍', label: 'In Detail', text: 'Goal specification encompasses all the ways an agent receives, interprets, and refines its understanding of what it should accomplish. This includes the system prompt (persistent behavioral instructions), user messages (task-specific instructions), success criteria (how to know when done), and the ongoing dialogue through which ambiguity is.' },
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
