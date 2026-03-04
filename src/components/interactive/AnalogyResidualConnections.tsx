import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyResidualConnections() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🛤', label: 'Highway Bypass', text: 'Residual connections are highway bypasses around a town. Traffic (information) can go through the town (the layer) for processing, but it also has a direct highway that skips around it. The output is the original traffic plus whatever the town contributed. This ensures that even if the town adds nothing useful, traffic is never blocked.' },
    { emoji: '📝', label: 'Editing a Draft', text: 'Writing a residual connection is like editing: you keep your original draft (input) and add corrections on top. The layer computes "what should change," and this delta is added to the original. Even after 100 rounds of editing (layers), the original voice is preserved. Without this, deep networks forget their starting point entirely.' },
    { emoji: '🧬', label: 'DNA + Mutations', text: 'Each generation passes down the full DNA (residual input) plus small mutations (layer output). The child has the complete original genome plus incremental changes. This is how information flows through 96+ layers without degrading: each layer only needs to learn a small refinement, not reconstruct everything from scratch.' },
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
