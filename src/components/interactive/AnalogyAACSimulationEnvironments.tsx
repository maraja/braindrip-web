import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACSimulationEnvironments() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a flight simulator. Before a pilot flies a real aircraft carrying 200 passengers, they spend hundreds of hours in a simulator that replicates the cockpit, weather conditions, equipment failures, and air traffic. The simulator is cheaper, safer, and more repeatable than real flight.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A simulation environment consists of: State (the current configuration of the simulated world -- files in a repository, pages on a website, records in a database), Actions (the operations the agent can perform -- edit files, click buttons, run queries), Observations (what the agent perceives after each action -- file contents, page screenshots,.' },
    { emoji: '🔍', label: 'In Detail', text: 'The need for simulation is acute because agents take actions. A traditional LLM generates text -- if it hallucinates, you read a wrong answer. An agent that hallucinates might delete files, send incorrect emails, make unauthorized purchases, or corrupt databases. Testing agents against real systems during development is dangerous and expensive.' },
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
