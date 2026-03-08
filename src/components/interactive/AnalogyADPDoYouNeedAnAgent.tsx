import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyADPDoYouNeedAnAgent() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you need to get across town. You could walk, take a bus, hail a taxi, or charter a helicopter. Each option trades off cost, speed, flexibility, and reliability differently. Walking is cheap and predictable but slow. A taxi is flexible but expensive.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Before reaching for an agent framework, answer these five questions about your task:  If you answered "No" to any question, that row tells you the simpler alternative to use.' },
    { emoji: '🔍', label: 'In Detail', text: 'The same logic applies when building with LLMs. An autonomous agent (the helicopter) gives you maximum flexibility: it can reason, use tools, adapt to unexpected situations, and pursue open-ended goals.' },
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
