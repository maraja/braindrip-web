import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyADPIncrementalMigrationPatterns() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think about renovating a house while living in it. You do not demolish the entire structure and rebuild from scratch -- you would have nowhere to live during construction. Instead, you renovate one room at a time. You update the kitchen while the rest of the house functions normally.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Borrowed from Martin Fowler\'s Strangler Fig Application pattern, this approach replaces individual steps in an existing workflow with agent-driven decisions, one at a time. Process:  Map the existing workflow. Document every step, its inputs, its outputs, and its decision logic.' },
    { emoji: '🔍', label: 'In Detail', text: 'Incremental migration applies the same principle to adding agent capabilities to existing software systems. Most organizations do not have the luxury of building an agent system from scratch on a blank canvas. They have existing workflows, existing APIs, existing user expectations, and existing reliability standards.' },
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
