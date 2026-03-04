import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function Analogy3DParallelism() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏢', label: 'Office Building', text: '3D parallelism is like organizing a massive company. Data parallelism is having multiple identical offices (each processes different clients). Pipeline parallelism is floors within an office (each floor handles a different stage). Tensor parallelism is desks within a floor (splitting a single task across workers). Combining all three dimensions lets you scale to thousands of GPUs training models with trillions of parameters.' },
    { emoji: '🗺', label: '3D Grid', text: 'Imagine GPUs arranged in a 3D grid. Along the X-axis: data parallelism (same layers, different data). Along the Y-axis: pipeline parallelism (different layers, same data). Along the Z-axis: tensor parallelism (same layer split across GPUs). Each axis has different communication requirements: tensor needs the fastest links (within node), pipeline needs moderate bandwidth, data parallelism tolerates slower connections.' },
    { emoji: '🎭', label: 'Theater Production', text: 'A massive theater production uses all three strategies. Data parallelism: multiple theaters showing the same play to different audiences. Pipeline parallelism: different crews handle Act 1, Act 2, Act 3 sequentially. Tensor parallelism: within each act, roles are split across performers on stage. 3D parallelism combines these to train models like GPT-4 across 10,000+ GPUs.' },
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
