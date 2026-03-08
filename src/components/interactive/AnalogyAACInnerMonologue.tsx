import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACInnerMonologue() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a diplomat negotiating a treaty. Outwardly, they present composed, measured statements. Inwardly, they are running a constant stream of strategic calculations: "They just conceded on tariffs, which means agriculture is their real priority. If I push hard on agriculture now, they might walk away.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Inner monologue requires a clear architectural boundary between private reasoning and public output. This is implemented in several ways:  Dedicated thinking blocks: The API provides a separate field for thinking content. The model generates thinking first, then produces the visible response.' },
    { emoji: '🔍', label: 'In Detail', text: 'Inner monologue in AI agents is the architectural pattern of providing the model with a private reasoning space that is not visible in the user-facing output. The agent "thinks" before it "speaks" or "acts," and these thoughts are logged for debugging but hidden from the end user.' },
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
