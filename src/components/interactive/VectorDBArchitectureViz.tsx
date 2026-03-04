import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const labelStyle = {
  fontSize: '10px',
  fontWeight: 700 as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: '#6E8B6B',
};

const searchModes = [
  {
    id: 'exact',
    name: 'Exact (Brute Force)',
    desc: 'Compares query against every vector. Guarantees best results but O(n) complexity.',
    steps: ['Compare query to vector 1', 'Compare query to vector 2', '...compare all 1M vectors...', 'Compare query to vector 1,000,000', 'Sort all scores', 'Return top-K'],
    accuracy: 100,
    speed: 15,
    color: '#C76B4A',
  },
  {
    id: 'hnsw',
    name: 'HNSW (Hierarchical NSW)',
    desc: 'Multi-layer graph where higher layers have fewer nodes. Greedy search from top layer down.',
    steps: ['Enter at top layer (8 nodes)', 'Greedy traverse to nearest neighbor', 'Drop to next layer (32 nodes)', 'Greedy traverse from entry point', 'Drop to base layer (1M nodes)', 'Local search around entry point', 'Return top-K neighbors'],
    accuracy: 95,
    speed: 92,
    color: '#8BA888',
  },
  {
    id: 'ivf',
    name: 'IVF (Inverted File Index)',
    desc: 'Partitions vectors into clusters. Only searches nearby clusters instead of all vectors.',
    steps: ['Identify nearest cluster centroid', 'Also check 2 adjacent centroids', 'Search ~3% of total vectors', 'Score candidates within clusters', 'Return top-K from candidates'],
    accuracy: 90,
    speed: 85,
    color: '#D4A843',
  },
];

const layers = [
  { name: 'Layer 3 (Top)', nodes: 4, connections: 3, color: '#C76B4A' },
  { name: 'Layer 2', nodes: 8, connections: 5, color: '#D4A843' },
  { name: 'Layer 1', nodes: 16, connections: 8, color: '#8BA888' },
  { name: 'Layer 0 (Base)', nodes: 32, connections: 12, color: '#5B8DB8' },
];

export default function VectorDBArchitectureViz() {
  const [modeIdx, setModeIdx] = useState(1);
  const [step, setStep] = useState(0);

  const mode = searchModes[modeIdx];
  const maxStep = mode.steps.length - 1;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={labelStyle}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Vector Database Architecture
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Explore how vector databases index and search. Compare exact vs approximate nearest neighbor algorithms.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {searchModes.map((m, i) => (
          <button key={m.id} onClick={() => { setModeIdx(i); setStep(0); }} style={{
            padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer',
            border: `1px solid ${modeIdx === i ? m.color : '#E5DFD3'}`,
            background: modeIdx === i ? m.color + '12' : 'transparent',
            color: modeIdx === i ? m.color : '#5A6B5C', fontWeight: modeIdx === i ? 600 : 400,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>{m.name}</button>
        ))}
      </div>

      <div style={{ padding: '0.6rem 0.8rem', background: '#F0EBE1', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.82rem', color: '#5A6B5C' }}>
        {mode.desc}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ ...labelStyle, marginBottom: '0.5rem' }}>
            {modeIdx === 1 ? 'HNSW Layer Structure' : 'Index Architecture'}
          </div>
          {modeIdx === 1 ? (
            <div>
              {layers.map((layer, i) => (
                <div key={i} style={{ marginBottom: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.72rem', color: layer.color, fontWeight: 600, minWidth: '80px' }}>{layer.name}</span>
                    <span style={{ fontSize: '0.68rem', color: '#B0A898' }}>{layer.nodes} nodes</span>
                  </div>
                  <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                    {Array.from({ length: Math.min(layer.nodes, 20) }).map((_, j) => {
                      const isActive = step >= (3 - i) && modeIdx === 1;
                      return (
                        <div key={j} style={{
                          width: '14px', height: '14px', borderRadius: '50%',
                          background: isActive ? layer.color : '#E5DFD3', transition: 'background 0.3s ease',
                          border: `1px solid ${isActive ? layer.color : '#D0C9BD'}`,
                        }} />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {Array.from({ length: 40 }).map((_, i) => {
                const searchedRatio = modeIdx === 0 ? (step + 1) / mode.steps.length : 0.1;
                const isSearched = i < 40 * searchedRatio;
                return (
                  <div key={i} style={{
                    width: '16px', height: '16px', borderRadius: '3px',
                    background: isSearched ? mode.color + '88' : '#E5DFD3',
                    transition: 'background 0.2s ease',
                  }} />
                );
              })}
              <div style={{ width: '100%', fontSize: '0.7rem', color: '#B0A898', marginTop: '0.3rem' }}>
                {modeIdx === 0 ? `Searching ${((step + 1) / mode.steps.length * 100).toFixed(0)}% of vectors` : `Searching ~3% of vectors (cluster-based)`}
              </div>
            </div>
          )}
        </div>

        <div>
          <div style={{ ...labelStyle, marginBottom: '0.5rem' }}>Search Steps</div>
          {mode.steps.map((s, i) => (
            <div key={i} style={{
              padding: '0.35rem 0.6rem', marginBottom: '0.25rem', borderRadius: '6px', fontSize: '0.78rem',
              transition: 'all 0.2s ease',
              background: i === step ? mode.color + '12' : 'transparent',
              border: `1px solid ${i === step ? mode.color + '44' : 'transparent'}`,
              color: i <= step ? '#2C3E2D' : '#B0A898',
              fontWeight: i === step ? 600 : 400,
            }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: mode.color, marginRight: '0.4rem' }}>
                {i <= step ? '●' : '○'}
              </span>
              {s}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.6rem', background: '#F0EBE1', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.72rem', color: '#7A8B7C', marginBottom: '0.2rem' }}>Accuracy (Recall@10)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ flex: 1, height: '10px', background: '#E5DFD3', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${mode.accuracy}%`, background: '#8BA888', borderRadius: '4px' }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D' }}>{mode.accuracy}%</span>
          </div>
        </div>
        <div style={{ padding: '0.6rem', background: '#F0EBE1', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.72rem', color: '#7A8B7C', marginBottom: '0.2rem' }}>Speed Score</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ flex: 1, height: '10px', background: '#E5DFD3', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${mode.speed}%`, background: '#D4A843', borderRadius: '4px' }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D' }}>{mode.speed}%</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
          padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem', cursor: step === 0 ? 'not-allowed' : 'pointer',
          border: '1px solid #E5DFD3', background: 'transparent', color: step === 0 ? '#B0A898' : '#5A6B5C',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>Back</button>
        <button onClick={() => setStep(Math.min(maxStep, step + 1))} disabled={step === maxStep} style={{
          padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem', cursor: step === maxStep ? 'not-allowed' : 'pointer',
          border: '1px solid #C76B4A', background: step === maxStep ? '#E5DFD3' : 'rgba(199, 107, 74, 0.08)',
          color: step === maxStep ? '#B0A898' : '#C76B4A', fontWeight: 600,
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>Next</button>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#7A8B7C' }}>
          Step {step + 1} / {mode.steps.length}
        </span>
      </div>
    </div>
  );
}
