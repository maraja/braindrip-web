import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE03FlashAttentionAndHardwareAwareComputing() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are a chef in a kitchen where the pantry is in a separate building. The actual cooking — chopping, seasoning, sauteing — takes seconds. But every time you need an ingredient, you walk five minutes to the pantry and five minutes back.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Modern GPUs like the NVIDIA A100 have two levels of memory: SRAM (on-chip, ~20 MB, ~19 TB/s bandwidth) and HBM (off-chip, 40-80 GB, ~2 TB/s bandwidth). That is a 10x bandwidth gap.' },
    { emoji: '🔍', label: 'In Detail', text: 'Standard attention computes the full N x N attention matrix, writes it to GPU high-bandwidth memory (HBM), reads it back for the softmax, writes the result again, and reads it once more for the value multiplication. Each read/write to HBM takes orders of magnitude longer than the actual arithmetic.' },
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
