import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyGroupedQueryAttention() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏫', label: 'Shared Teacher', text: 'In a school, instead of every student having a private tutor (standard multi-head), groups of students share one teacher (key-value head). Each student still asks their own unique questions (queries), but the teacher provides the same reference material to the whole group. This saves resources while barely losing quality.' },
    { emoji: '📋', label: 'Shared Clipboard', text: 'In an office, multiple employees (query heads) share a single reference binder (key-value pair) instead of each keeping their own copy. They still write their own reports differently, but they consult the same shared reference. GQA drastically cuts memory for the KV cache during inference with minimal accuracy loss.' },
    { emoji: '🚌', label: 'Bus Pools', text: 'Instead of every commuter driving their own car (multi-head attention), groups carpool in shared buses (grouped KV heads). Each rider still has a unique destination (query), but they share the vehicle (keys and values). This is the sweet spot between full multi-head (all private cars) and multi-query (one giant bus for everyone).' },
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
