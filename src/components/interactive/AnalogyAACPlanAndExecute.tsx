import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACPlanAndExecute() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a project manager who creates a detailed project plan before any work begins: "First, gather requirements from the client. Second, design the database schema. Third, implement the API endpoints. Fourth, write integration tests.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The planner component receives the user\'s goal and generates a numbered list of steps. This is typically done with a single LLM call using a prompt like:  The planner should produce steps that are specific enough to be individually executable but abstract enough to allow flexibility in how each step is carried out.' },
    { emoji: '🔍', label: 'In Detail', text: 'Plan-and-Execute applies this same separation to AI agents. Instead of interleaving reasoning and acting step-by-step (as in ReAct), the agent first generates a complete multi-step plan for achieving the goal, then executes each step sequentially.' },
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
