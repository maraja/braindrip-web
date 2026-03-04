import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const queryTokens = ['what', 'causes', 'rain'];
const docTokens = ['water', 'evaporates', 'forming', 'clouds', 'causing', 'precipitation'];
const simMatrix = [
  [0.35, 0.12, 0.08, 0.15, 0.18, 0.22],
  [0.10, 0.15, 0.12, 0.08, 0.88, 0.42],
  [0.22, 0.08, 0.10, 0.32, 0.35, 0.91],
];

export default function ColBERTInteractionViz() {
  const [hoverQ, setHoverQ] = useState<number | null>(null);
  const [hoverD, setHoverD] = useState<number | null>(null);

  const maxSims = queryTokens.map((_, qi) => Math.max(...simMatrix[qi]));
  const finalScore = maxSims.reduce((s, v) => s + v, 0).toFixed(2);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>ColBERT Late Interaction</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Per-token query embeddings interact with per-token doc embeddings via MaxSim.</p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
          <thead>
            <tr>
              <td style={{ padding: '0.3rem' }}></td>
              {docTokens.map((dt, j) => (
                <td key={j} onMouseEnter={() => setHoverD(j)} onMouseLeave={() => setHoverD(null)} style={{
                  padding: '0.3rem 0.4rem', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
                  color: hoverD === j ? '#C76B4A' : '#5A6B5C', fontWeight: hoverD === j ? 700 : 400, cursor: 'pointer',
                }}>{dt}</td>
              ))}
              <td style={{ padding: '0.3rem 0.5rem', fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 700 }}>MaxSim</td>
            </tr>
          </thead>
          <tbody>
            {queryTokens.map((qt, i) => (
              <tr key={i}>
                <td onMouseEnter={() => setHoverQ(i)} onMouseLeave={() => setHoverQ(null)} style={{
                  padding: '0.3rem 0.5rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
                  color: hoverQ === i ? '#C76B4A' : '#5A6B5C', fontWeight: hoverQ === i ? 700 : 400, cursor: 'pointer',
                }}>{qt}</td>
                {simMatrix[i].map((sim, j) => {
                  const isMax = sim === Math.max(...simMatrix[i]);
                  const isHovered = hoverQ === i || hoverD === j;
                  return (
                    <td key={j} style={{
                      padding: '0.25rem 0.35rem', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem',
                      background: isMax ? 'rgba(199,107,74,0.15)' : isHovered ? 'rgba(212,168,67,0.08)' : `rgba(139,168,136,${sim * 0.3})`,
                      color: isMax ? '#C76B4A' : '#5A6B5C', fontWeight: isMax ? 700 : 400, borderRadius: '3px',
                    }}>{sim.toFixed(2)}</td>
                  );
                })}
                <td style={{ padding: '0.25rem 0.5rem', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#C76B4A', fontWeight: 700 }}>
                  {maxSims[i].toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.72rem', color: '#7A8B7C' }}>Score = sum(MaxSim) =</span>
        <span style={{ fontSize: '1.1rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#C76B4A' }}>{finalScore}</span>
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: '#F0EBE1', borderRadius: '6px', fontSize: '0.72rem', color: '#5A6B5C' }}>
        Each query token finds its best-matching document token (MaxSim). The final score is the sum of all MaxSim values. Hover over tokens to highlight interactions.
      </div>
    </div>
  );
}
