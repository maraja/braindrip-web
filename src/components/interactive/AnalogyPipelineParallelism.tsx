import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyPipelineParallelism() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏭', label: 'Assembly Line', text: 'A car factory has stations: chassis (GPU 1), engine (GPU 2), interior (GPU 3), paint (GPU 4). Each car moves through all stations sequentially. Pipeline parallelism assigns consecutive layers to different GPUs. GPU 1 processes layers 1-24, GPU 2 handles 25-48, etc. The challenge: while GPU 4 paints car A, GPUs 1-3 are idle unless you overlap with micro-batches.' },
    { emoji: '🚿', label: 'Relay Race', text: 'In a relay race, runner 1 passes the baton to runner 2, who passes to runner 3. Each runner covers their segment. Pipeline parallelism is this relay: each GPU runs its assigned layers and passes activations to the next GPU. Micro-batching (splitting the batch into smaller pieces) keeps all runners active simultaneously, reducing the "pipeline bubble" of idle time.' },
    { emoji: '🍝', label: 'Kitchen Stations', text: 'A restaurant kitchen has stations: prep, cook, plate, garnish. One order flows through all stations. Pipeline parallelism assigns groups of layers to different GPUs, passing intermediate results (activations) between them. The key optimization is micro-batching: while Station 2 cooks Order A, Station 1 can prep Order B. Still, some "bubble" time is unavoidable when the pipeline fills and drains.' },
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
