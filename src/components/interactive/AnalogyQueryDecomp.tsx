import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyQueryDecomp() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🧩', label: 'Divide and Conquer', text: 'A complex question like "Compare the GDP growth of US and China over the last decade and explain the key drivers" is too broad for one retrieval. Query decomposition breaks it into sub-queries: (1) US GDP growth 2015-2025, (2) China GDP growth 2015-2025, (3) key drivers of US growth, (4) key drivers of China growth. Each sub-query retrieves targeted documents, and the answers are synthesized into a comprehensive response.' },
    { emoji: '📋', label: 'Project Planning', text: 'A project manager breaks "launch the product" into discrete tasks: design, build, test, market, ship. Query decomposition breaks complex questions into retrievable sub-questions that can be answered independently, then combined. This is especially powerful for multi-hop questions where answering one part depends on the answer to another — the system can chain retrievals to follow the logical thread.' },
    { emoji: '🔬', label: 'Microscope Zoom', text: 'A scientist studying an ecosystem examines it at multiple scales: the whole biome, individual species, specific organisms. Multi-step retrieval examines a question at multiple levels: first decompose the question, then retrieve for each sub-question, then the answers to early sub-questions can inform later retrieval. This iterative refinement handles complex questions that a single retrieval pass would answer incompletely or incorrectly.' },
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
