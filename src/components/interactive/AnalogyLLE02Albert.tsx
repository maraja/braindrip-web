import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE02Albert() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a library with 24 floors, where each floor has its own complete copy of every reference book. The building is enormous, but most of the space is wasted duplication — each floor\'s books are nearly identical. Now imagine redesigning the library so that all 24 floors share a single set of reference books, accessed via a central elevator.' },
    { emoji: '⚙️', label: 'How It Works', text: 'In standard BERT, the word embedding matrix directly maps vocabulary tokens to hidden-dimension vectors. With a vocabulary of V=30,000 tokens and hidden dimension H=1024 (BERT-Large), this embedding matrix has V x H = 30.7 million parameters.' },
    { emoji: '🔍', label: 'In Detail', text: 'In September 2019, Zhenzhong Lan, Mingda Chen, Sebastian Goodman, Kevin Gimpel, Piyush Sharma, and Ravi Soricut at Google Research published ALBERT (A Lite BERT). The paper addressed a practical concern: BERT-Large had 340 million parameters, and the trend toward larger models was accelerating.' },
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
