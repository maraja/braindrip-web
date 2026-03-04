import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

export default function MultiTokenSpeedupCalc() {
  const [tokensN, setTokensN] = useState(3);
  const [seqLen, setSeqLen] = useState(500);
  const [acceptRate, setAcceptRate] = useState(80);

  const autoSteps = seqLen;
  const effectiveN = 1 + (tokensN - 1) * (acceptRate / 100);
  const multiSteps = Math.ceil(seqLen / effectiveN);
  const speedup = autoSteps / multiSteps;
  const overhead = 1 + (tokensN - 1) * 0.15;
  const realSpeedup = speedup / overhead;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Multi-Token Speedup Calculator</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Calculate theoretical speedup from predicting multiple tokens per step.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#5A6B5C', fontWeight: 600 }}>Tokens predicted per step (N): {tokensN}</label>
          <input type="range" min={2} max={8} value={tokensN} onChange={e => setTokensN(+e.target.value)} style={{ width: '100%', accentColor: '#C76B4A' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#5A6B5C', fontWeight: 600 }}>Sequence length: {seqLen} tokens</label>
          <input type="range" min={100} max={2000} step={100} value={seqLen} onChange={e => setSeqLen(+e.target.value)} style={{ width: '100%', accentColor: '#C76B4A' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#5A6B5C', fontWeight: 600 }}>Token acceptance rate: {acceptRate}%</label>
          <input type="range" min={30} max={100} value={acceptRate} onChange={e => setAcceptRate(+e.target.value)} style={{ width: '100%', accentColor: '#C76B4A' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {[
          { label: 'Autoregressive Steps', value: autoSteps, color: '#C76B4A' },
          { label: 'Multi-Token Steps', value: multiSteps, color: '#8BA888' },
          { label: 'Theoretical Speedup', value: `${speedup.toFixed(1)}x`, color: '#D4A843' },
        ].map(item => (
          <div key={item.label} style={{ padding: '0.6rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: '1.1rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const }}>Real-World Speedup (with overhead)</div>
            <div style={{ fontSize: '0.72rem', color: '#5A6B5C', marginTop: '0.15rem' }}>Accounting for {((overhead - 1) * 100).toFixed(0)}% per-step verification overhead</div>
          </div>
          <div style={{ fontSize: '1.4rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: realSpeedup >= 2 ? '#8BA888' : '#D4A843' }}>{realSpeedup.toFixed(1)}x</div>
        </div>
      </div>
    </div>
  );
}
