import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const BATCH_SIZES = [1, 2, 4, 8, 16, 32, 48, 64, 96, 128];

function throughput(bs: number): number {
  return 50 * Math.log2(bs + 1) * Math.min(1, 2 - bs / 80);
}

function latency(bs: number): number {
  return 20 + 0.8 * bs + 0.005 * bs * bs;
}

export default function ThroughputLatencyTradeoff() {
  const [batchIdx, setBatchIdx] = useState(4);
  const [slaMs, setSlaMs] = useState(100);

  const bs = BATCH_SIZES[batchIdx];
  const tp = throughput(bs);
  const lat = latency(bs);
  const maxTp = Math.max(...BATCH_SIZES.map(throughput));
  const maxLat = latency(BATCH_SIZES[BATCH_SIZES.length - 1]);
  const chartH = 160;
  const chartW = 100;

  const sweetSpot = BATCH_SIZES.reduce((best, b) => {
    const l = latency(b);
    const t = throughput(b);
    return l <= slaMs && t > throughput(best) ? b : best;
  }, 1);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Throughput vs Latency Tradeoff</h3>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
            <span style={{ color: '#2C3E2D' }}>Batch Size</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', fontWeight: 600 }}>{bs}</span>
          </div>
          <input type="range" min={0} max={BATCH_SIZES.length - 1} value={batchIdx} onChange={(e) => setBatchIdx(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#C76B4A' }} />
        </div>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
            <span style={{ color: '#2C3E2D' }}>Latency SLA</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#D4A843', fontWeight: 600 }}>{slaMs} ms</span>
          </div>
          <input type="range" min={30} max={200} step={5} value={slaMs} onChange={(e) => setSlaMs(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#D4A843' }} />
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '1.5rem', paddingLeft: '2.5rem', paddingBottom: '1.5rem' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: '1.5rem', width: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.55rem', color: '#999', fontFamily: "'JetBrains Mono', monospace", textAlign: 'right' as const }}>
          <span>{maxTp.toFixed(0)}</span><span>{(maxTp / 2).toFixed(0)}</span><span>0</span>
        </div>

        <svg width="100%" height={chartH} viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none"
          style={{ overflow: 'visible' }}>
          {/* SLA line */}
          <line x1={0} y1={chartH - (slaMs / maxLat) * chartH} x2={chartW} y2={chartH - (slaMs / maxLat) * chartH}
            stroke="#D4A843" strokeWidth={0.5} strokeDasharray="2,2" />

          {/* Throughput curve */}
          <polyline fill="none" stroke="#8BA888" strokeWidth={1.5}
            points={BATCH_SIZES.map((b, i) => {
              const x = (i / (BATCH_SIZES.length - 1)) * chartW;
              const y = chartH - (throughput(b) / maxTp) * chartH;
              return `${x},${y}`;
            }).join(' ')} />

          {/* Latency curve */}
          <polyline fill="none" stroke="#C76B4A" strokeWidth={1.5}
            points={BATCH_SIZES.map((b, i) => {
              const x = (i / (BATCH_SIZES.length - 1)) * chartW;
              const y = chartH - (latency(b) / maxLat) * chartH;
              return `${x},${y}`;
            }).join(' ')} />

          {/* Current point - throughput */}
          <circle cx={(batchIdx / (BATCH_SIZES.length - 1)) * chartW} cy={chartH - (tp / maxTp) * chartH}
            r={3} fill="#8BA888" stroke="#fff" strokeWidth={1} />

          {/* Current point - latency */}
          <circle cx={(batchIdx / (BATCH_SIZES.length - 1)) * chartW} cy={chartH - (lat / maxLat) * chartH}
            r={3} fill="#C76B4A" stroke="#fff" strokeWidth={1} />

          {/* Vertical line at current position */}
          <line x1={(batchIdx / (BATCH_SIZES.length - 1)) * chartW} y1={0}
            x2={(batchIdx / (BATCH_SIZES.length - 1)) * chartW} y2={chartH}
            stroke="rgba(44,62,45,0.15)" strokeWidth={0.5} strokeDasharray="2,2" />
        </svg>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#999', fontFamily: "'JetBrains Mono', monospace", marginTop: '0.25rem' }}>
          {BATCH_SIZES.map((b, i) => <span key={b} style={{ flex: 1, textAlign: 'center' as const, fontWeight: i === batchIdx ? 700 : 400, color: i === batchIdx ? '#2C3E2D' : '#999' }}>{b}</span>)}
        </div>
        <div style={{ textAlign: 'center' as const, fontSize: '0.7rem', color: '#999', marginTop: '0.2rem' }}>Batch Size</div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '1.25rem', fontSize: '0.72rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: 16, height: 3, borderRadius: 2, background: '#8BA888' }} />
          <span style={{ color: '#2C3E2D' }}>Throughput (tok/s)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: 16, height: 3, borderRadius: 2, background: '#C76B4A' }} />
          <span style={{ color: '#2C3E2D' }}>Latency (ms)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: 16, height: 3, borderRadius: 2, background: '#D4A843', borderTop: '1px dashed #D4A843' }} />
          <span style={{ color: '#2C3E2D' }}>SLA limit</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Throughput', value: `${tp.toFixed(0)} tok/s`, color: '#8BA888' },
          { label: 'Latency', value: `${lat.toFixed(0)} ms`, color: lat > slaMs ? '#C76B4A' : '#2C3E2D' },
          { label: 'Sweet Spot', value: `BS = ${sweetSpot}`, color: '#D4A843' },
        ].map((item) => (
          <div key={item.label} style={{ flex: 1, minWidth: '100px', background: 'rgba(229,223,211,0.2)', borderRadius: '10px', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase' as const }}>{item.label}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: lat > slaMs ? 'rgba(199,107,74,0.08)' : 'rgba(139,168,136,0.08)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#2C3E2D', lineHeight: 1.6 }}>
        {lat > slaMs ? (
          <>At batch size <strong>{bs}</strong>, latency ({lat.toFixed(0)} ms) <strong style={{ color: '#C76B4A' }}>exceeds the SLA</strong> of {slaMs} ms.
            The optimal batch size under this SLA is <strong style={{ color: '#D4A843' }}>{sweetSpot}</strong>, achieving {throughput(sweetSpot).toFixed(0)} tok/s.</>
        ) : (
          <>At batch size <strong>{bs}</strong>, latency ({lat.toFixed(0)} ms) is <strong style={{ color: '#8BA888' }}>within SLA</strong>.
            Throughput is {tp.toFixed(0)} tok/s. The sweet spot maximizing throughput within SLA is <strong style={{ color: '#D4A843' }}>BS={sweetSpot}</strong>.</>
        )}
      </div>
    </div>
  );
}
