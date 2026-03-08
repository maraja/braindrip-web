import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyADPArchitectureSelectionFramework() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Choosing an agent architecture is like choosing a vehicle for a journey. A bicycle is simple, cheap, and efficient for short trips on smooth roads. A car handles longer distances and varied terrain. A bus moves many passengers on fixed routes. A train carries heavy loads at high speed on predefined tracks.' },
    { emoji: '⚙️', label: 'How It Works', text: 'ReAct Loop: The model reasons about what to do, takes an action (tool call), observes the result, and repeats. No explicit plan, no external state tracking. The model\'s context window IS the state.' },
    { emoji: '🔍', label: 'In Detail', text: 'Agent architectures work the same way. A ReAct loop is the bicycle: minimal structure, maximum flexibility, great for straightforward tool-use tasks. A plan-and-execute system is the car: more overhead, but it handles complex multi-step work. A state machine is the train: fast and reliable on its tracks, but inflexible.' },
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
