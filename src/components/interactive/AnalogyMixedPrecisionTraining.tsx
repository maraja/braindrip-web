import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMixedPrecisionTraining() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '💰', label: 'Currency Mix', text: 'Mixed precision is like using dollars for big transactions and cents for small ones. The forward pass and most computations use FP16/BF16 (compact, fast "cents"), while a master copy of weights is kept in FP32 ("full dollars") for precise accumulation. This halves memory usage and doubles speed on modern GPUs, while loss scaling prevents tiny gradients from rounding to zero.' },
    { emoji: '📐', label: 'Draft vs. Final', text: 'An architect makes rough sketches (FP16) quickly to explore ideas, but the final blueprint (FP32) is drawn with full precision. Mixed precision training works the same way: the fast forward and backward passes use low-precision arithmetic for speed, but the weight update (the "blueprint revision") happens in full precision to avoid accumulated rounding errors over millions of steps.' },
    { emoji: '🏎', label: 'Race Car Parts', text: 'A race car uses lightweight carbon fiber (FP16) everywhere possible for speed, but keeps critical components like the engine block in heavy-duty steel (FP32) for reliability. Mixed precision uses 16-bit for bulk computation (matrix multiplications) and 32-bit for sensitive operations (loss accumulation, weight updates). The result: nearly 2x faster training with negligible quality loss.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
