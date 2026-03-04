import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function ScaleFullVsPEFT() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>⚡ REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>Full fine-tuning updates all parameters. For Llama 3 70B, that's 70 billion parameters needing gradients and optimizer states. What's the hardware requirement difference?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact →
        </button>
      ) : (
        <div style={{ padding: '0.75rem 1rem', background: '#C76B4A' + '0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
          <p style={{ fontSize: '0.9rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>Full fine-tuning of Llama 3 70B requires 16× A100 80GB GPUs (~$50K/month in cloud). PEFT methods (LoRA) achieve 95-99% of full fine-tuning quality on 2× A100 GPUs (~$6K/month) — an 8x cost reduction. This gap is why PEFT democratized fine-tuning: startups and researchers can customize 70B models on a $6K budget instead of $50K.</p>
        </div>
      )}
    </div>
  );
}
