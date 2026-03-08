import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPTextualEntailment() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a courtroom where a lawyer presents a piece of evidence (the premise) and makes a claim (the hypothesis). The judge must decide: does the evidence actually support that claim? Textual entailment poses exactly this question to a machine.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The Recognizing Textual Entailment (RTE) Challenge, launched in 2005 as part of the PASCAL network, was the first systematic evaluation of textual entailment systems. The challenge provided text-hypothesis pairs with binary labels (entailment or not-entailment).' },
    { emoji: '🔍', label: 'In Detail', text: 'For example, given P = "The cat sat on the mat in the living room" and H = "An animal was on a piece of furniture," entailment holds because a cat is an animal, a mat can be considered a piece of furniture, and "sat on" implies "was on.' },
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
