import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEExtendedThinkingAndThinkingBudgets() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you ask someone a difficult question. If you demand an immediate answer, they might blurt out something plausible but wrong. If you give them five minutes to think, they will likely produce a much better answer.' },
    { emoji: '⚙️', label: 'How It Works', text: 'In extended thinking models, the total generation is divided into two categories: thinking tokens and output tokens. Thinking tokens are the model\'s internal reasoning -- scratch work, hypothesis testing, self-correction, and deliberation. Output tokens are the final response shown to the user.' },
    { emoji: '🔍', label: 'In Detail', text: 'This concept has been implemented differently by different providers. Anthropic\'s Claude models offer "extended thinking" as an API parameter where the model generates thinking tokens visible in a separate field.' },
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
