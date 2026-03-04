import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyPagedAttention() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📖', label: 'Virtual Memory', text: 'Just like an OS uses virtual memory pages so programs don\'t need contiguous RAM, Paged Attention stores KV cache in non-contiguous blocks. Each sequence gets a page table mapping logical positions to physical GPU memory blocks. This eliminates fragmentation — no more wasting memory on pre-allocated padding.' },
    { emoji: '🏨', label: 'Hotel Room Allocation', text: 'Without paging, serving requests is like reserving an entire hotel floor for each guest "just in case." Paged Attention assigns rooms one at a time as guests actually need them, and rooms don\'t have to be on the same floor. This lets you host far more guests (requests) in the same hotel (GPU memory).' },
    { emoji: '📂', label: 'Filing Cabinet', text: 'Imagine a filing cabinet where each drawer can hold pages from any document. Instead of reserving entire drawers per document (wasting space on half-empty drawers), you file pages wherever there\'s room and keep an index. Paged Attention does this with KV cache blocks, nearly eliminating memory waste and enabling much larger batch sizes.' },
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
