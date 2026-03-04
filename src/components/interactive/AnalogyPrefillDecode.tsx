import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyPrefillDecode() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏭', label: 'Two Departments', text: 'Prefill (reading the prompt) is compute-heavy like a design department; decode (generating tokens) is memory-heavy like a manufacturing floor. Disaggregation puts them in separate buildings (GPU pools) optimized for each job — big compute GPUs for prefill, memory-optimized GPUs for decode — so neither bottlenecks the other.' },
    { emoji: '🍳', label: 'Prep Kitchen & Line', text: 'Restaurants separate the prep kitchen (chopping, marinating) from the cooking line (plating orders one by one). Prefill is prep — processing the entire prompt in parallel. Decode is the line — generating tokens one at a time. By running them on separate GPU clusters, you can optimize each independently and avoid the prep work slowing down the line cooks.' },
    { emoji: '📬', label: 'Sorting vs Delivery', text: 'A postal service separates mail sorting (bulk parallel work) from delivery routes (sequential, one house at a time). Prefill-decode disaggregation does the same: prefill nodes sort through the entire prompt in one big parallel pass, then hand off the KV cache to decode nodes that generate tokens sequentially. Each pool scales independently based on demand.' },
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
