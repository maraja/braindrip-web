import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyRAPTOR() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🌲', label: 'Tree of Summaries', text: 'Imagine organizing a library: books go on shelves, shelves are summarized by section labels, sections by floor descriptions, and floors by a building directory. RAPTOR builds a tree like this: leaf nodes are original text chunks, which are clustered and summarized into parent nodes, which are further clustered and summarized upward. Retrieval can access any level — specific details from leaves or high-level themes from the root.' },
    { emoji: '🏔️', label: 'Altitude Levels', text: 'At ground level you see individual trees; from a hilltop you see the forest; from a plane you see the landscape. RAPTOR creates multiple altitude levels for your documents: ground-level chunks for detailed retrieval, mid-level cluster summaries for thematic retrieval, and top-level summaries for broad questions. This hierarchical abstraction lets retrieval match the granularity of the question — zooming in or out as needed.' },
    { emoji: '📚', label: 'Textbook Structure', text: 'A good textbook has paragraphs (details), section summaries (main ideas), chapter summaries (themes), and a book abstract (overview). RAPTOR automatically creates this multi-level structure: clustering related chunks via embedding similarity, summarizing each cluster with an LLM, then recursively clustering and summarizing higher levels. Questions about details hit the bottom; questions about themes hit the top.' },
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
