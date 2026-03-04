import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyLoRA() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📎', label: 'Sticky Notes', text: 'LoRA adds small "sticky notes" (low-rank matrices A and B) next to the original weight matrices. Instead of rewriting the entire textbook (full fine-tuning), you attach sticky notes with corrections and additions. The original weights are frozen; only the sticky notes are trained. With rank r=16, you might train 0.1% of parameters while achieving 95%+ of full fine-tuning quality. The math: W_new = W_original + BA.' },
    { emoji: '🎛', label: 'Equalizer', text: 'A music equalizer adjusts a few frequency bands to transform the sound, rather than re-recording the song. LoRA inserts small trainable matrices (rank decomposition) that adjust the "frequency response" of frozen weight matrices. Because the update is low-rank (rank 8-64 vs. dimensions of thousands), the trainable parameters are tiny. The key insight: weight updates during fine-tuning empirically have low intrinsic rank.' },
    { emoji: '🔌', label: 'USB Adapter', text: 'A USB adapter plugs into your laptop and adds new functionality (Ethernet, HDMI) without modifying the hardware. LoRA plugs trainable low-rank matrices into each attention and FFN layer. During inference, these can be merged into the base weights (W + BA) with zero additional latency. You can also hot-swap different LoRA adapters for different tasks, all sharing the same base model.' },
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
