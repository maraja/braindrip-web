import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFHandlingHighCardinalityFeatures() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine trying to represent every ZIP code in the United States as a one-hot vector: you would create over 40,000 binary columns for a single feature. Most entries would be zero, the matrix would be enormous, and many ZIP codes would appear only once or twice in the training set.' },
    { emoji: '⚙️', label: 'How It Works', text: 'One-hot encoding maps a categorical feature with $. This creates several problems when cardinality is high:  Dimensionality explosion: p features with average cardinality c produce p  c$ columns after encoding. With user IDs, this can mean millions of columns.' },
    { emoji: '🔍', label: 'In Detail', text: 'A categorical feature is considered high-cardinality when the number of unique levels $$ is large enough that one-hot encoding creates a prohibitively wide, sparse matrix. Practical thresholds depend on dataset size, but features with hundreds to millions of categories (user IDs, product SKUs, IP addresses, city names) routinely appear in industry.' },
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
