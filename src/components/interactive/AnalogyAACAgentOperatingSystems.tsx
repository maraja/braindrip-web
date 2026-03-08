import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACAgentOperatingSystems() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think about why traditional operating systems exist. Before operating systems, each program managed its own hardware: its own memory allocation, its own disk access, its own display output. This was unsustainable as computers ran multiple programs simultaneously.' },
    { emoji: '⚙️', label: 'How It Works', text: 'In a traditional OS, process management handles creating, scheduling, suspending, and terminating processes. In an agent OS, "processes" are agent instances. Each agent has a lifecycle: Created (configuration loaded, initial state set), Ready (waiting for resources to begin execution), Running (actively making LLM calls and using tools), Waiting.' },
    { emoji: '🔍', label: 'In Detail', text: 'AI agents face an analogous problem. As systems run multiple agents simultaneously -- a coding agent, a research agent, a monitoring agent, a scheduling agent -- they need coordination. Which agent gets LLM inference capacity when demand exceeds supply? How do agents share knowledge (one agent\'s research findings might be useful to another)?' },
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
