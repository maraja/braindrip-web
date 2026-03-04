import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const SEED = { instruction: 'Explain the difference between a stack and a queue.', response: 'A stack follows Last-In-First-Out (LIFO), while a queue follows First-In-First-Out (FIFO)...' };

const ROUNDS = [
  {
    generated: [
      { instruction: 'Compare arrays and linked lists in terms of performance.', quality: 0.91, diverse: true },
      { instruction: 'What is the time complexity of binary search?', quality: 0.87, diverse: true },
      { instruction: 'Explain what a stack is and how it works.', quality: 0.42, diverse: false },
    ],
    diversity: 68, quality: 73, total: 3,
  },
  {
    generated: [
      { instruction: 'How does a hash table handle collisions?', quality: 0.93, diverse: true },
      { instruction: 'Explain the difference between BFS and DFS.', quality: 0.89, diverse: true },
      { instruction: 'What is a balanced binary search tree?', quality: 0.85, diverse: true },
      { instruction: 'Describe arrays and their performance characteristics.', quality: 0.38, diverse: false },
    ],
    diversity: 78, quality: 81, total: 7,
  },
  {
    generated: [
      { instruction: 'Explain dynamic programming with an example.', quality: 0.95, diverse: true },
      { instruction: 'What are the trade-offs of using recursion vs iteration?', quality: 0.88, diverse: true },
      { instruction: 'How does a priority queue differ from a regular queue?', quality: 0.92, diverse: true },
    ],
    diversity: 85, quality: 88, total: 10,
  },
];

export default function SyntheticDataGenerator() {
  const [round, setRound] = useState(0);
  const [showFiltered, setShowFiltered] = useState(false);
  const r = ROUNDS[round];
  const filtered = r.generated.filter(g => g.quality >= 0.7);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Self-Instruct Data Generation
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Watch how a seed instruction bootstraps diverse training data through iterative generation and filtering.
        </p>
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.25rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Seed instruction</div>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', fontWeight: 600 }}>{SEED.instruction}</div>
        <div style={{ fontSize: '0.78rem', color: '#5A6B5C', marginTop: '0.3rem', fontStyle: 'italic' }}>{SEED.response}</div>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', alignItems: 'center' }}>
        {ROUNDS.map((_, i) => (
          <button key={i} onClick={() => { setRound(i); setShowFiltered(false); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: '1px solid #E5DFD3', cursor: 'pointer',
            background: round === i ? '#2C3E2D' : 'transparent', color: round === i ? '#FDFBF7' : '#5A6B5C',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
          }}>Round {i + 1}</button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={() => setShowFiltered(!showFiltered)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${showFiltered ? '#C76B4A' : '#E5DFD3'}`, cursor: 'pointer',
            background: showFiltered ? '#C76B4A11' : 'transparent', color: showFiltered ? '#C76B4A' : '#5A6B5C',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
          }}>{showFiltered ? 'Show All' : 'Filter Low Quality'}</button>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        {(showFiltered ? filtered : r.generated).map((g, i) => (
          <div key={i} style={{
            padding: '0.65rem 0.85rem', marginBottom: '0.4rem', borderRadius: '8px',
            border: `1px solid ${g.quality >= 0.7 ? '#8BA88844' : '#C76B4A44'}`,
            background: g.quality >= 0.7 ? '#8BA88808' : '#C76B4A08',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#2C3E2D', flex: 1 }}>{g.instruction}</span>
              <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: g.quality >= 0.7 ? '#8BA88822' : '#C76B4A22', color: g.quality >= 0.7 ? '#8BA888' : '#C76B4A', fontWeight: 600 }}>Q:{(g.quality * 100).toFixed(0)}</span>
                {!g.diverse && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: '#D4A84322', color: '#D4A843', fontWeight: 600 }}>Dup</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {[
          { label: 'Diversity', value: `${r.diversity}%`, color: r.diversity > 80 ? '#8BA888' : '#D4A843' },
          { label: 'Avg Quality', value: `${r.quality}%`, color: r.quality > 80 ? '#8BA888' : '#D4A843' },
          { label: 'Total Examples', value: `${r.total}`, color: '#6E8B6B' },
        ].map(m => (
          <div key={m.label} style={{ background: '#F5F0E6', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: '0.72rem', color: '#8B9B8D', marginTop: '0.2rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
