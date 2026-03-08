import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFAssociationRules() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'When a grocery store notices that customers who buy diapers also tend to buy beer, that is an association rule in action. The store did not hypothesize this relationship in advance -- it emerged from mining millions of transaction records.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Three measures quantify the strength of a rule A  B:  Support: The fraction of transactions containing both A and B:  [equation]  Support measures how frequently the pattern occurs. Low-support rules may be statistically unreliable.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given a set of items I = \\&#123;i_1, i_2, , i_m\\&#125; and a database D of transactions where each transaction T  I, an association rule is an implication of the form A  B where A, B  I and A  B = . The rule asserts that transactions containing A tend to also contain B.' },
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
