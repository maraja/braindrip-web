import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPERoleAndPersonaPrompting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you need advice on a tax question. You could ask a friend who has some general knowledge, or you could ask a specialist — a tax attorney with 20 years of corporate experience.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Personas range from minimal framing to elaborate character descriptions:  Light framing (5-20 tokens):  Minimal activation. Broadly biases toward technical helpfulness but does not strongly constrain domain or style. Domain-specific role (20-50 tokens):  Moderate activation.' },
    { emoji: '🔍', label: 'In Detail', text: 'Role and persona prompting works similarly. When you tell a model "You are a senior tax attorney specializing in corporate tax law with 20 years of experience," you are not changing the model\'s parameters or giving it new knowledge.' },
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
