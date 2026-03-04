import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const benchmarks = [
  { name: 'MMLU', single: 87, moa: 93 },
  { name: 'GSM8K', single: 82, moa: 91 },
  { name: 'HumanEval', single: 78, moa: 88 },
  { name: 'AlpacaEval', single: 75, moa: 89 },
  { name: 'MT-Bench', single: 8.5, moa: 9.2 },
];

const tradeoffs = [
  { dim: 'Quality', single: 75, moa: 93 },
  { dim: 'Latency', single: 90, moa: 25 },
  { dim: 'Cost', single: 85, moa: 20 },
  { dim: 'Consistency', single: 80, moa: 90 },
];

export default function MoAvsingle() {
  const [view, setView] = useState<'bench' | 'trade'>('bench');

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Single Model vs MoA Ensemble</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare a single frontier model against a mixture-of-agents approach.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {(['bench', 'trade'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${view === v ? '#C76B4A' : '#E5DFD3'}`,
            background: view === v ? 'rgba(199,107,74,0.08)' : 'transparent', color: view === v ? '#C76B4A' : '#5A6B5C',
            fontWeight: view === v ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>{v === 'bench' ? 'Benchmarks' : 'Tradeoffs'}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {(view === 'bench' ? benchmarks : tradeoffs).map(item => {
          const label = 'name' in item ? item.name : item.dim;
          return (
            <div key={label} style={{ padding: '0.4rem 0.6rem', background: '#F0EBE1', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.3rem' }}>{label}</div>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.6rem', color: '#C76B4A', width: '36px', fontFamily: "'JetBrains Mono', monospace" }}>Solo</span>
                <div style={{ flex: 1, background: '#E5DFD3', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.single}%`, height: '100%', background: '#C76B4A', borderRadius: '4px', transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.6rem', fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', width: '28px' }}>{item.single}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.15rem' }}>
                <span style={{ fontSize: '0.6rem', color: '#8BA888', width: '36px', fontFamily: "'JetBrains Mono', monospace" }}>MoA</span>
                <div style={{ flex: 1, background: '#E5DFD3', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.moa}%`, height: '100%', background: '#8BA888', borderRadius: '4px', transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.6rem', fontFamily: "'JetBrains Mono', monospace", color: '#8BA888', width: '28px' }}>{item.moa}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(212,168,67,0.08)', borderRadius: '6px', fontSize: '0.75rem', color: '#5A6B5C' }}>
        {view === 'bench' ? 'MoA consistently outperforms single models on quality benchmarks.' : 'MoA trades latency and cost for higher quality and consistency.'}
      </div>
    </div>
  );
}
