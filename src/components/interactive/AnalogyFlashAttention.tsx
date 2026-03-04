import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyFlashAttention() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🍳', label: 'Cooking in Batches', text: 'Standard attention is like spreading all your ingredients across a huge countertop (GPU global memory) and walking back and forth. Flash Attention is like working with small batches on a cutting board right next to the stove (SRAM) — you process a tile, serve it, then grab the next batch. Less walking means faster cooking.' },
    { emoji: '📦', label: 'Warehouse vs Workbench', text: 'Imagine a craftsman who keeps running to a distant warehouse for parts. Flash Attention reorganizes the work so everything needed for each step fits on the small workbench (fast on-chip SRAM). By tiling the attention matrix into blocks that fit in fast memory, it avoids costly round-trips to slow GPU memory.' },
    { emoji: '🚿', label: 'Streaming vs Filling a Pool', text: 'Standard attention fills an enormous pool (materializing the full N×N attention matrix) before using it. Flash Attention streams the water through a pipe — computing attention in tiles, never storing the full matrix. This uses far less memory and is faster because reading/writing to slow memory is the real bottleneck, not the math itself.' },
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
