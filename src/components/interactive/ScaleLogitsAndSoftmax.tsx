import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function ScaleLogitsAndSoftmax() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>⚡ REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>Every time GPT-4 generates a token, it computes a probability distribution over its entire 100K+ token vocabulary. How fast does this need to happen?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact →
        </button>
      ) : (
        <div style={{ padding: '0.75rem 1rem', background: '#C76B4A' + '0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
          <p style={{ fontSize: '0.9rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>Every ~30ms at typical generation speed. The softmax over 100K+ logits must be numerically stable (float overflow at e^{700}+), which is why the "subtract max" trick is critical. Temperature scaling of these logits controls creativity vs. accuracy — the same model can write poetry (T=1.2) or code (T=0.2).</p>
        </div>
      )}
    </div>
  );
}
