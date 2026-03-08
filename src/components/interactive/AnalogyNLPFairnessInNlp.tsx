import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPFairnessInNlp() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a university admissions office that wants to be "fair." One definition says admit the same percentage from every demographic group (demographic parity). Another says among equally qualified applicants, accept at the same rate regardless of group (equalized odds).' },
    { emoji: '⚙️', label: 'How It Works', text: 'Demographic Parity (Statistical Parity): A system satisfies demographic parity if its positive prediction rate is equal across protected groups. Formally: P(Y_hat = 1  A = b) for all groups a, b. In NLP, this might mean a resume screening system recommends the same percentage of candidates from each racial group.' },
    { emoji: '🔍', label: 'In Detail', text: 'Fairness in NLP brings this same tension into language technology. It goes beyond detecting bias (covered in bias-in-nlp.md) to defining what equitable performance means, measuring whether systems achieve it, and developing interventions to close gaps.' },
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
