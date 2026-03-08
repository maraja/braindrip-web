import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE01Roberta() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two students with identical brains. One studies for a week with a mediocre textbook and a confusing study guide. The other studies for a month with a library of excellent books and a clear, focused curriculum. The second student dramatically outperforms the first — not because their brain is better, but because their preparation was better.' },
    { emoji: '⚙️', label: 'How It Works', text: 'BERT used two pre-training objectives: Masked Language Modeling (MLM) and Next Sentence Prediction (NSP). RoBERTa\'s first finding was that NSP actively hurt performance. The team tested four input formats: segment pairs with NSP (original BERT), segment pairs without NSP, full sentences from a single document without NSP, and full sentences.' },
    { emoji: '🔍', label: 'In Detail', text: 'In July 2019, Yinhan Liu, Myle Ott, Naman Goyal, Jingfei Du, Mandar Joshi, Danqi Chen, Omer Levy, Mike Lewis, Luke Zettlemoyer, and Veselin Stoyanov at Facebook AI (now Meta AI) published a paper with a deceptively simple thesis: BERT\'s training recipe was suboptimal, and fixing it — without changing a single architectural component — could match.' },
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
