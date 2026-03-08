import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACSwarmAndEmergentBehavior() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Watch a flock of starlings at dusk performing a murmuration — thousands of birds creating breathtaking, coordinated aerial patterns. There is no leader bird directing the show. No bird knows the overall shape. Each bird follows three simple rules: fly in roughly the same direction as your neighbors, stay close to them, and do not crash into them.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Each agent in a swarm follows locally-scoped rules defined by its system prompt and tool set:  Competence rule: "Handle requests about billing. If the request is about technical issues, hand off to the technical support agent." Escalation rule: "If the customer is frustrated or the issue is complex, hand off to a senior agent.' },
    { emoji: '🔍', label: 'In Detail', text: 'Swarm architecture in AI agent systems applies this principle. Instead of a manager agent explicitly coordinating workers, multiple agents operate autonomously with simple behavioral rules and the ability to interact with a shared environment or hand off conversations to other agents. No single agent has a global view or controls the system.' },
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
