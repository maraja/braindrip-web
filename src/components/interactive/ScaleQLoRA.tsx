import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function ScaleQLoRA() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>⚡ REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>QLoRA combines 4-bit quantization with LoRA, keeping the base model in NF4 precision while training adapters in BF16. What does this mean for hardware requirements?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact →
        </button>
      ) : (
        <div style={{ padding: '0.75rem 1rem', background: '#C76B4A' + '0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
          <p style={{ fontSize: '0.9rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>QLoRA fine-tunes a 65B model on a single 48GB GPU — previously impossible without 4+ GPUs. A 70B model shrinks from 140GB (FP16) to ~35GB (NF4), fitting on one A100. QLoRA matches full 16-bit fine-tuning quality within 0.5% on benchmarks. This single paper (May 2023) enabled thousands of open-source fine-tunes that previously required enterprise-grade clusters.</p>
        </div>
      )}
    </div>
  );
}
