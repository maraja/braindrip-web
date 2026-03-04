import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyContinuousBatching() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎢', label: 'Roller Coaster', text: 'Static batching is like a roller coaster that waits until every seat is filled before launching and won\'t let anyone off until the ride ends. Continuous batching is like a moving sidewalk — passengers step on and off at any point. When one request finishes, its slot is immediately filled by a new request, keeping the GPU busy at all times.' },
    { emoji: '🍽️', label: 'Restaurant Seating', text: 'In static batching, the restaurant seats a group, serves everyone, then clears the whole table — even if one person finished ages ago. Continuous batching is like a sushi conveyor belt: each diner grabs plates at their own pace, and empty seats are immediately offered to waiting customers. GPU utilization stays high because slots never sit idle.' },
    { emoji: '🚇', label: 'Subway vs Charter Bus', text: 'A charter bus (static batch) waits for everyone to board, drives the route, and nobody leaves until the final stop. A subway (continuous batching) lets people get on and off at every station. In LLM serving, requests vary wildly in length — continuous batching ensures short requests don\'t have to wait for long ones, dramatically improving throughput.' },
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
