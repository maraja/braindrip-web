import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFInformationTheory() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you learn that the sun rose this morning. That is unsurprising -- it carries almost no information. Now imagine learning that a major earthquake just struck your city. That is highly surprising and carries enormous information.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The entropy of a discrete random variable X with PMF p(x) is:  [equation]  By convention, 0  0 = 0 (justified by continuity). When using _2, entropy is measured in bits; with , in nats. Entropy quantifies the average uncertainty or "surprise" in a distribution:  Deterministic (p(x) = 1 for some x): H = 0 bits.' },
    { emoji: '🔍', label: 'In Detail', text: 'In ML, information theory provides the mathematical foundation for loss functions (cross-entropy), model comparison (KL divergence), feature selection (mutual information), and the theoretical limits of data compression and communication. It is the bridge between probability and learning.' },
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
