import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyZeROFSDP() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📦', label: 'Shared Storage', text: 'In a data-parallel setup, every GPU keeps a full copy of model weights, optimizer states, and gradients — triply redundant. ZeRO is like a shared storage system: instead of every roommate owning a full set of tools, each keeps 1/N of the tools. When you need a specific tool, you ask the roommate who has it. ZeRO Stage 1 shares optimizer states, Stage 2 adds gradients, Stage 3 shares everything.' },
    { emoji: '🏘', label: 'Neighborhood Library', text: 'Instead of every house having a complete encyclopedia set (wasteful), the neighborhood shares one set across houses: House 1 keeps A-F, House 2 keeps G-L, etc. When you need a volume, you borrow it. FSDP (Fully Sharded Data Parallelism) does exactly this: model parameters are sharded across GPUs and gathered on-demand for computation, then discarded. Memory scales as 1/N of the full model.' },
    { emoji: '🎪', label: 'Circus Act', text: 'In a juggling act, instead of each performer holding all the balls (memory overflow), they pass balls between them in perfect coordination. Each performer holds only a few balls at any time. ZeRO/FSDP coordinates GPUs the same way: each GPU stores only its shard of the parameters, gathers the full layer just before computation, uses it, and discards it. Communication replaces redundant storage.' },
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
