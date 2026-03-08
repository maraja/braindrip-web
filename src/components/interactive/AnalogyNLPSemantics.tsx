import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPSemantics() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Syntax tells you that "Colorless green ideas sleep furiously" is a grammatically perfect English sentence. Semantics tells you it is meaningless. Semantics is the branch of linguistics concerned with meaning -- what words mean, how word meanings combine into phrase and sentence meanings, and how the same string of characters can mean different.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Lexical semantics studies the meanings of individual words and the relationships between them. Polysemy and homonymy: Most common words have multiple senses. "Bank" can mean a financial institution, a river bank, a pool shot, or the act of tilting an aircraft.' },
    { emoji: '🔍', label: 'In Detail', text: 'Think of semantics as the "algebra of meaning." Just as algebra has variables (words), operators (grammatical rules), and evaluation rules (interpretation), semantics provides the machinery to compute what a sentence means from its parts.' },
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
