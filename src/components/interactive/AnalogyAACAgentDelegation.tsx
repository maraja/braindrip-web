import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACAgentDelegation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a senior architect receiving a commission to design a hospital. They do not design every detail themselves. Instead, they decompose the project: structural engineering goes to a structural specialist, HVAC to a mechanical engineer, electrical systems to an electrician, and interior design to a specialist.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The manager agent analyzes the incoming task and breaks it into discrete, assignable subtasks. Effective decomposition follows principles:  Independence: Subtasks should be as independent as possible, minimizing dependencies between sub-agents. Completeness: The subtasks should collectively cover the entire original task with no gaps.' },
    { emoji: '🔍', label: 'In Detail', text: 'In AI agent systems, delegation occurs when a manager agent (sometimes called an orchestrator, supervisor, or planner) receives a task too complex or broad for a single agent and spawns or routes to specialist sub-agents.' },
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
