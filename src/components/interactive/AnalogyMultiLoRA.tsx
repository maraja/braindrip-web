import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMultiLoRA() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎮', label: 'Game Mods', text: 'A game engine (base model) runs the same core code for all players, but each player can load different mods (LoRA adapters). Multi-LoRA serving keeps one base model in memory and dynamically loads/swaps tiny adapter files per request. User A gets the medical LoRA, User B gets the legal LoRA, User C gets the creative writing LoRA — all sharing 99.9% of the same GPU memory.' },
    { emoji: '📺', label: 'TV Channels', text: 'One TV (base model on GPU) can show hundreds of channels (LoRA adapters). You only tune into one channel at a time, and switching is instant because the hardware is shared. Multi-LoRA serving uses techniques like S-LoRA: batching requests across different adapters, storing adapters in CPU memory, and paging them to GPU on-demand. This serves thousands of customized models at near the cost of one.' },
    { emoji: '🏨', label: 'Hotel Rooms', text: 'A hotel (base model) has a shared structure — plumbing, electricity, lobby. Each room (LoRA adapter) has custom decor for different guests. Multi-LoRA serving is running the hotel: one building serves many guests with personalized rooms. The operational tricks: adapter caching, request batching across adapters, and optimized GPU memory management to minimize adapter swapping overhead between requests.' },
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
