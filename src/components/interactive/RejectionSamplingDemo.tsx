import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49.71;
  return x - Math.floor(x);
}

const PROMPT = 'Explain quantum entanglement simply.';

function generateResponses(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const score = seededRandom(i * 7 + 3) * 0.6 + 0.2;
    const quality = score > 0.7 ? 'Excellent' : score > 0.5 ? 'Good' : score > 0.35 ? 'Fair' : 'Weak';
    const snippets = [
      'Two particles linked across distance...',
      'Imagine two coins that always match...',
      'Quantum state shared between particles...',
      'Spooky action at a distance means...',
      'Entangled pairs share quantum info...',
      'When you measure one particle, the...',
      'Think of it like magical dice...',
      'Einstein called it spooky because...',
      'Particles remain connected regardless...',
      'A fundamental quantum phenomenon...',
      'Measuring one instantly affects the...',
      'Like two gloves in separate boxes...',
      'Quantum correlation beyond classical...',
      'Non-local connection between states...',
      'Superposition of paired particles...',
      'The wavefunction describes both as...',
    ];
    return { id: i + 1, snippet: snippets[i % snippets.length], score: parseFloat(score.toFixed(3)), quality };
  });
}

const N_VALUES = [1, 2, 4, 8, 16];

export default function RejectionSamplingDemo() {
  const [n, setN] = useState(4);
  const responses = generateResponses(n);
  const bestIdx = responses.reduce((bi, r, i) => r.score > responses[bi].score ? i : bi, 0);
  const bestScores = N_VALUES.map(nv => {
    const rs = generateResponses(nv);
    return Math.max(...rs.map(r => r.score));
  });

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Best-of-N Rejection Sampling
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Generate N candidates and select the highest-scored response. Quality rises with N, but cost scales linearly.
        </p>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Prompt</div>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>{PROMPT}</div>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {N_VALUES.map(nv => (
          <button key={nv} onClick={() => setN(nv)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px',
            border: `1px solid ${n === nv ? '#C76B4A' : '#E5DFD3'}`,
            background: n === nv ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
            color: n === nv ? '#C76B4A' : '#5A6B5C',
            fontWeight: n === nv ? 600 : 400,
            fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
          }}>
            N={nv}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem', maxHeight: '220px', overflowY: 'auto' }}>
        {responses.map((r, i) => (
          <div key={r.id} style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: '0.5rem',
            alignItems: 'center', padding: '0.45rem 0.7rem', borderRadius: '6px',
            background: i === bestIdx ? 'rgba(139, 168, 136, 0.15)' : '#F0EBE1',
            border: i === bestIdx ? '1.5px solid #8BA888' : '1px solid transparent',
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600 }}>#{r.id}</span>
            <span style={{ fontSize: '0.75rem', color: '#5A6B5C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.snippet}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: 600, color: i === bestIdx ? '#8BA888' : '#5A6B5C' }}>{r.score}</span>
            {i === bestIdx && <span style={{ fontSize: '0.6rem', background: '#8BA888', color: '#fff', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>BEST</span>}
          </div>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem 1rem' }}>
        <div style={{ fontSize: '0.7rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>Quality vs Compute Tradeoff</div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'end', height: '60px' }}>
          {N_VALUES.map((nv, i) => (
            <div key={nv} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%', height: `${bestScores[i] * 60}px`,
                background: nv === n ? '#C76B4A' : '#8BA888',
                borderRadius: '3px 3px 0 0', opacity: nv === n ? 1 : 0.4,
                transition: 'all 0.2s ease',
              }} />
              <span style={{ fontSize: '0.58rem', color: nv === n ? '#C76B4A' : '#7A8B7C', marginTop: '0.2rem', fontWeight: nv === n ? 600 : 400, fontFamily: "'JetBrains Mono', monospace" }}>N={nv}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.65rem', color: '#7A8B7C' }}>
          <span>Compute: {n}x inference cost</span>
          <span>Best score: {responses[bestIdx].score}</span>
        </div>
      </div>
    </div>
  );
}
