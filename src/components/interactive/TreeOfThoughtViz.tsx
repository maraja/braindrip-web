import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const tree = {
  root: '24 Game: Make 24 from 2, 3, 4, 8',
  branches: [
    { thought: '2 + 3 = 5', children: [
      { thought: '5 × 4 = 20', result: '20 + 8 = 28', score: 0.2, correct: false },
      { thought: '5 × 8 = 40', result: '40 - 4 = 36', score: 0.1, correct: false },
    ]},
    { thought: '8 - 2 = 6', children: [
      { thought: '6 × 4 = 24', result: '24 × (3/3)... need 3', score: 0.6, correct: false },
      { thought: '6 × 3 = 18', result: '18 + 4 = 22', score: 0.15, correct: false },
    ]},
    { thought: '8 ÷ (4-2) = 4', children: [
      { thought: '... wait, 8/(4-2) = 4', result: '4 × (3!) = 24', score: 0.3, correct: false },
      { thought: '4 × 3 = 12', result: 'need ×2 → not available', score: 0.1, correct: false },
    ]},
  ],
  bestPath: '(8 - 2) = 6, but let us try: 2 × (8 + 4) = 24? No. Answer: (4 - 2) × (8 + 3 + 1)... Actually: 8 × 3 = 24 (remaining 2,4 → ×1 if 4/2=2... wait) → 8 × (4 - (2/... hmm. Best: (8 × 3) × (4/4)... uses two 4s.',
};

export default function TreeOfThoughtViz() {
  const [expandedBranch, setExpandedBranch] = useState<number | null>(0);
  const [showScores, setShowScores] = useState(false);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Tree of Thought Visualization</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Explore how ToT explores multiple reasoning paths and evaluates each.</p>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '0.75rem', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#2C3E2D', fontWeight: 600 }}>
        {tree.root}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <button onClick={() => setShowScores(!showScores)} style={{
          padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #D4A843', background: showScores ? 'rgba(212,168,67,0.1)' : 'transparent',
          fontSize: '0.68rem', color: '#D4A843', cursor: 'pointer',
        }}>Show Eval Scores</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {tree.branches.map((b, i) => (
          <div key={i}>
            <div onClick={() => setExpandedBranch(expandedBranch === i ? null : i)} style={{
              padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${expandedBranch === i ? '#C76B4A' : '#E5DFD3'}`,
              background: expandedBranch === i ? 'rgba(199,107,74,0.04)' : 'transparent',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#2C3E2D' }}>Branch {i + 1}: {b.thought}</span>
                <span style={{ fontSize: '0.7rem', color: '#7A8B7C' }}>{expandedBranch === i ? '▼' : '▶'}</span>
              </div>
            </div>
            {expandedBranch === i && (
              <div style={{ marginLeft: '1.5rem', marginTop: '0.3rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {b.children.map((c, j) => (
                  <div key={j} style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', borderLeft: `3px solid ${c.correct ? '#8BA888' : '#E5DFD3'}`, background: '#F0EBE1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#5A6B5C' }}>{c.thought}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#7A8B7C' }}>→ {c.result}</div>
                    </div>
                    {showScores && (
                      <span style={{ fontSize: '0.68rem', fontFamily: "'JetBrains Mono', monospace", color: c.score > 0.5 ? '#8BA888' : '#C76B4A', fontWeight: 600 }}>{(c.score * 100).toFixed(0)}%</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(139,168,136,0.08)', borderRadius: '6px', fontSize: '0.75rem', color: '#5A6B5C' }}>
        ToT explores {tree.branches.length} branches with {tree.branches.reduce((s, b) => s + b.children.length, 0)} leaves total. The evaluator scores each path to find the most promising direction.
      </div>
    </div>
  );
}
