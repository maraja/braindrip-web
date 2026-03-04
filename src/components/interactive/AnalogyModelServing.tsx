import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyModelServing() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🍽️', label: 'Restaurant Kitchen', text: 'Model serving is like running a restaurant kitchen. The trained model is your recipe book, the GPU is the stove, and the serving framework (vLLM, TGI, etc.) is the kitchen manager who takes orders, manages the cooking queue, plates dishes, and sends them out. It handles load balancing, batching, and keeping the kitchen running smoothly under pressure.' },
    { emoji: '📞', label: 'Call Center', text: 'Think of model serving as a call center for AI. The model is the knowledgeable agent, and the serving infrastructure routes incoming calls (requests), manages hold queues (request batching), handles multiple calls simultaneously, and ensures no one waits too long. Scaling up means adding more agents (replicas) or making each agent handle calls faster.' },
    { emoji: '⚡', label: 'Power Grid', text: 'A power plant generates electricity but needs a grid to deliver it to homes. Similarly, a trained model produces predictions but needs a serving system to deliver them as an API — handling authentication, rate limiting, load balancing across GPUs, auto-scaling based on demand, and ensuring reliable uptime. The model is the plant; serving is the grid.' },
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
