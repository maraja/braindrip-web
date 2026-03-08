import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACDynamicToolCreation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a chef who, upon encountering an unusual ingredient that none of their existing kitchen tools can properly handle, fabricates a custom tool on the spot — maybe bending a piece of metal into a specialized scraper. They test it on a small piece first, and if it works, they add it to their tool rack for future use.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Dynamic tool creation follows a consistent pipeline:  Gap identification: The agent encounters a sub-task where no existing tool is suitable. This might be explicit ("I don\'t have a tool for this") or implicit (attempting to use an existing tool and failing).' },
    { emoji: '🔍', label: 'In Detail', text: 'This capability represents a qualitative shift in agent design. Most agents operate with a fixed toolkit defined by developers at design time. An agent with dynamic tool creation can extend its own capabilities at runtime, adapting to novel situations without human intervention.' },
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
