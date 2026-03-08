import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE07TheBottlenecksThatMotivatedTransformers() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a factory assembly line where each worker must wait for the previous worker to finish before starting. No matter how many workers you hire, the line moves at the speed of one worker at a time. Now imagine an alternative factory where every worker can operate simultaneously on different parts of the product.' },
    { emoji: '⚙️', label: 'How It Works', text: 'An RNN computes h_t = f(h_&#123;t-1&#125;, x_t). This means h_2 depends on h_1, h_3 depends on h_2, and so on. For a sequence of length n, you need n sequential operations — regardless of how many GPU cores are available.' },
    { emoji: '🔍', label: 'In Detail', text: 'This wasn\'t merely an inconvenience. The explosive growth of GPU computing power — NVIDIA\'s V100 (2017) could perform 125 teraflops of mixed-precision operations — was being wasted on sequential architectures that could not exploit parallelism.' },
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
