import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPSyntaxAndGrammar() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'If morphology is about building words from parts, syntax is about building sentences from words. Syntax is the invisible scaffolding that turns a bag of words into a structured meaning-bearing utterance.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Constituency grammars model sentences as hierarchical trees of nested phrases. The sentence "The cat sat on the mat" has the structure:  Each non-terminal node (S, NP, VP, PP) represents a phrase type: S = sentence, NP = noun phrase, VP = verb phrase, PP = prepositional phrase.' },
    { emoji: '🔍', label: 'In Detail', text: 'Think of syntax as the grammar of Lego construction. Individual bricks (words) snap together according to rules: certain shapes connect only in certain configurations, and the final structure has a hierarchical organization -- walls are made of rows, rows are made of bricks.' },
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
