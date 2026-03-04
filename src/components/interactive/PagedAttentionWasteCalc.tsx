import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const BLOCK_SIZE = 16;

function generateLengths(n: number, dist: string): number[] {
  const lengths: number[] = [];
  for (let i = 0; i < n; i++) {
    if (dist === 'uniform') lengths.push(256 + Math.round(Math.sin(i * 1.7) * 200 + 200));
    else if (dist === 'skewed') lengths.push(64 + Math.round(Math.pow(i / n, 2) * 1800));
    else lengths.push(128 + Math.round(Math.abs(Math.sin(i * 0.8)) * 900));
  }
  return lengths;
}

export default function PagedAttentionWasteCalc() {
  const [numSeqs, setNumSeqs] = useState(16);
  const [distribution, setDistribution] = useState('uniform');
  const [maxAlloc, setMaxAlloc] = useState(2048);

  const lengths = generateLengths(numSeqs, distribution);
  const contiguousWaste = lengths.reduce((acc, len) => acc + (maxAlloc - len), 0);
  const contiguousTotal = numSeqs * maxAlloc;
  const pagedWaste = lengths.reduce((acc, len) => acc + (BLOCK_SIZE - (len % BLOCK_SIZE || BLOCK_SIZE)), 0);
  const pagedTotal = lengths.reduce((acc, len) => acc + Math.ceil(len / BLOCK_SIZE) * BLOCK_SIZE, 0);
  const actualTotal = lengths.reduce((a, b) => a + b, 0);
  const contiguousEfficiency = ((actualTotal / contiguousTotal) * 100);
  const pagedEfficiency = ((actualTotal / pagedTotal) * 100);
  const savings = contiguousTotal - pagedTotal;

  const maxLen = Math.max(...lengths);
  const barMaxH = 80;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>PagedAttention Memory Waste Reduction</h3>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
            <span style={{ color: '#2C3E2D' }}>Concurrent Sequences</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', fontWeight: 600 }}>{numSeqs}</span>
          </div>
          <input type="range" min={4} max={64} value={numSeqs} onChange={(e) => setNumSeqs(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#C76B4A' }} />
        </div>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
            <span style={{ color: '#2C3E2D' }}>Max Allocation (contiguous)</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', fontWeight: 600 }}>{maxAlloc}</span>
          </div>
          <input type="range" min={512} max={8192} step={256} value={maxAlloc} onChange={(e) => setMaxAlloc(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#C76B4A' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['uniform', 'skewed', 'mixed'].map((d) => (
          <button key={d} onClick={() => setDistribution(d)} style={{
            padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.78rem', cursor: 'pointer',
            border: distribution === d ? '2px solid #D4A843' : '1px solid #E5DFD3',
            background: distribution === d ? 'rgba(212,168,67,0.08)' : '#fff',
            color: distribution === d ? '#D4A843' : '#2C3E2D', fontWeight: distribution === d ? 600 : 400,
            textTransform: 'capitalize' as const,
          }}>{d}</button>
        ))}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.4rem', fontWeight: 600 }}>Sequence Lengths (tokens)</div>
        <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: barMaxH + 10 }}>
          {lengths.slice(0, 32).map((len, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%', minWidth: '4px', borderRadius: '3px 3px 0 0',
                height: `${Math.max(3, (len / Math.max(maxAlloc, maxLen)) * barMaxH)}px`,
                background: '#8BA888', transition: 'all 0.3s',
              }} />
              {numSeqs <= 20 && (
                <div style={{ fontSize: '0.5rem', color: '#999', marginTop: '2px', fontFamily: "'JetBrains Mono', monospace" }}>
                  {len}
                </div>
              )}
            </div>
          ))}
          {numSeqs > 32 && (
            <div style={{ fontSize: '0.65rem', color: '#999', padding: '0.5rem' }}>+{numSeqs - 32} more</div>
          )}
        </div>
        <div style={{ height: '2px', background: '#C76B4A', marginTop: '2px', position: 'relative' }}>
          <span style={{ position: 'absolute', right: 0, top: '-14px', fontSize: '0.6rem', color: '#C76B4A', fontFamily: "'JetBrains Mono', monospace" }}>
            max_alloc={maxAlloc}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Contiguous Allocation', total: contiguousTotal, waste: contiguousWaste, eff: contiguousEfficiency, color: '#C76B4A' },
          { label: 'Paged Allocation', total: pagedTotal, waste: pagedWaste, eff: pagedEfficiency, color: '#8BA888' },
        ].map((item) => (
          <div key={item.label} style={{ flex: 1, minWidth: '160px', background: 'rgba(229,223,211,0.2)', borderRadius: '10px', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#999', fontWeight: 600, marginBottom: '0.3rem' }}>{item.label}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
              <span style={{ color: '#2C3E2D' }}>Allocated</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{item.total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
              <span style={{ color: '#2C3E2D' }}>Wasted</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: item.color, fontWeight: 600 }}>{item.waste.toLocaleString()}</span>
            </div>
            <div style={{ background: '#E5DFD3', borderRadius: '6px', height: '10px', overflow: 'hidden', marginTop: '0.4rem' }}>
              <div style={{ width: `${item.eff}%`, height: '100%', background: item.color, borderRadius: '6px', transition: 'width 0.3s' }} />
            </div>
            <div style={{ fontSize: '0.65rem', color: '#999', marginTop: '0.2rem', textAlign: 'right' as const }}>
              {item.eff.toFixed(1)}% efficient
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(139,168,136,0.08)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#2C3E2D', lineHeight: 1.6 }}>
        With <strong>{numSeqs} sequences</strong>, PagedAttention saves <strong style={{ color: '#8BA888' }}>{savings.toLocaleString()} tokens</strong> of
        memory ({((savings / contiguousTotal) * 100).toFixed(1)}% reduction).
        Contiguous allocation wastes <strong style={{ color: '#C76B4A' }}>{((contiguousWaste / contiguousTotal) * 100).toFixed(0)}%</strong> of
        memory due to pre-allocation padding, while paged allocation wastes only the last block per sequence.
      </div>
    </div>
  );
}
