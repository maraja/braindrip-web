import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyTensorParallelism() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🧩', label: 'Split Jigsaw', text: 'A single weight matrix is too large for one GPU — so you cut it in half. GPU 1 holds the left columns, GPU 2 the right columns. Each computes its portion of the matrix multiplication, then they combine results. Tensor parallelism splits individual layers (tensors) across GPUs, requiring fast communication (NVLink) because GPUs must exchange data within every single layer.' },
    { emoji: '🏗', label: 'Wall Building', text: 'Two bricklayers build the same wall, but one lays the left half and the other the right half. They must synchronize at each row to ensure alignment. Tensor parallelism similarly splits each layer\'s computation across GPUs that must synchronize after every operation. This makes it ideal for GPUs within a single node (fast interconnect) but poor for GPUs across nodes (slow network).' },
    { emoji: '📰', label: 'Newspaper Layout', text: 'A newspaper page is too large for one printer. So the left half is printed on one press and the right half on another, then stitched together. Tensor parallelism splits the "page" (weight matrix) across GPUs. The attention heads can be naturally split (each GPU computes a subset of heads), and the FFN can be column-split then row-split across two matrix multiplications.' },
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
