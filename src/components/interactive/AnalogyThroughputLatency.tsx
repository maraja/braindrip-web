import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyThroughputLatency() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🚌', label: 'Bus vs Sports Car', text: 'Latency is the sports car — it gets one person to the destination fast. Throughput is the bus — it carries 50 people but each person waits longer. In LLM serving, you choose: optimize for how fast one user gets a response (latency), or how many users you can serve per second (throughput). Batching increases throughput but can add latency.' },
    { emoji: '🏭', label: 'Assembly Line', text: 'A factory can build one custom car quickly (low latency) or run a high-volume assembly line that produces many cars per hour (high throughput) but each individual car takes longer door-to-door. LLM serving faces the same tradeoff: batching more requests together increases tokens-per-second but each user may wait a bit longer for their response.' },
    { emoji: '🍕', label: 'Pizza Delivery', text: 'A single pizza delivered immediately = low latency. Waiting to batch 10 deliveries into one trip = high throughput (more pizzas per hour) but each customer waits longer. LLM inference engines constantly balance this: should we process this request now or wait a few milliseconds to batch it with others for better GPU utilization?' },
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
