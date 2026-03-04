import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyKVCache() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📋', label: 'Waiter\'s Notepad', text: 'A KV cache is like a waiter who writes down every dish each guest has ordered so far. When a new course comes, they don\'t re-ask the whole table — they just check the notepad and add the new order. Without it, the model would re-read the entire conversation from scratch for every single new token.' },
    { emoji: '🧮', label: 'Running Total', text: 'Imagine a cashier keeping a running subtotal instead of re-scanning every item in the cart each time you add something. The KV cache stores the key-value pairs from all previous tokens so attention only needs to compute the new token\'s interaction with existing ones, not recompute everything.' },
    { emoji: '📚', label: 'Sticky Notes in a Book', text: 'Think of reading a mystery novel and placing sticky notes on every important clue. When a new chapter references an earlier event, you flip to the sticky note instead of re-reading the whole book. The KV cache is those sticky notes — pre-computed attention states that let the model quickly look back without redoing all the math.' },
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
