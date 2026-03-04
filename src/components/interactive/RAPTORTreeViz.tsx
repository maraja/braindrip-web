import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const levels = [
  { name: 'Leaf Chunks', desc: 'Original text split into chunks, each embedded', count: 12, items: ['Chunk 1: Neural networks...', 'Chunk 2: Backprop...', 'Chunk 3: Gradient descent...', 'Chunk 4: Loss functions...'], color: '#8BA888' },
  { name: 'Cluster Summaries', desc: 'Similar chunks clustered and summarized by LLM', count: 4, items: ['Summary A: Core ML training concepts', 'Summary B: Architecture design', 'Summary C: Optimization techniques'], color: '#D4A843' },
  { name: 'High-Level Summary', desc: 'Top-level summary capturing the entire document theme', count: 1, items: ['Meta-Summary: Comprehensive overview of deep learning fundamentals covering architectures, training, and optimization'], color: '#C76B4A' },
];

export default function RAPTORTreeViz() {
  const [levelIdx, setLevelIdx] = useState(0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>RAPTOR Hierarchical Tree</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Leaf chunks clustered into summaries, building a tree of abstractions.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
        {[...levels].reverse().map((level, ri) => {
          const i = levels.length - 1 - ri;
          return (
            <div key={level.name} onClick={() => setLevelIdx(i)} style={{
              padding: '0.6rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${levelIdx === i ? level.color : '#E5DFD3'}`,
              background: levelIdx === i ? level.color + '10' : 'transparent',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: level.color }}>Level {i}: {level.name}</span>
                <span style={{ fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace", color: '#7A8B7C' }}>{level.count} nodes</span>
              </div>
              {levelIdx === i && (
                <div style={{ marginTop: '0.35rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#5A6B5C', marginBottom: '0.3rem' }}>{level.desc}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {level.items.map((item, j) => (
                      <div key={j} style={{ padding: '0.25rem 0.4rem', borderRadius: '4px', background: level.color + '10', border: `1px solid ${level.color}20`, fontSize: '0.68rem', color: '#5A6B5C' }}>{item}</div>
                    ))}
                    {level.count > level.items.length && (
                      <div style={{ fontSize: '0.6rem', color: '#7A8B7C', textAlign: 'center' }}>...and {level.count - level.items.length} more</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#7A8B7C', padding: '0.4rem', background: '#F0EBE1', borderRadius: '6px' }}>
        Abstraction increases ↑ | Granularity increases ↓
      </div>
    </div>
  );
}
