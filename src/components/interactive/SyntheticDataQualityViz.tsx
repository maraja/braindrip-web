import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const DATA_POINTS = [
  { x: 5, y: 95, label: 'Expert-written' }, { x: 12, y: 91, label: 'High quality' },
  { x: 18, y: 88, label: 'Curated' }, { x: 25, y: 84, label: 'Reviewed' },
  { x: 30, y: 79, label: 'Auto-filtered' }, { x: 38, y: 72, label: 'Model-scored' },
  { x: 45, y: 65, label: 'Lightly filtered' }, { x: 55, y: 58, label: 'Bulk gen' },
  { x: 62, y: 50, label: 'Unfiltered mix' }, { x: 70, y: 42, label: 'Noisy data' },
  { x: 78, y: 35, label: 'Low quality' }, { x: 88, y: 25, label: 'Mostly noise' },
  { x: 95, y: 15, label: 'Pure noise' },
];

const lossAtThreshold = (t: number) => {
  const kept = DATA_POINTS.filter(p => p.y >= t);
  if (kept.length === 0) return [3.2, 3.0, 2.9, 2.85, 2.82];
  const avgQ = kept.reduce((s, p) => s + p.y, 0) / kept.length;
  const n = kept.length;
  const base = 3.5 - (avgQ / 100) * 1.8 - Math.log(n + 1) * 0.15;
  return [0, 1, 2, 3, 4].map(i => Math.max(0.4, base + (4 - i) * (base * 0.18)));
};

export default function SyntheticDataQualityViz() {
  const [threshold, setThreshold] = useState(50);
  const W = 320, H = 200, PAD = 35;
  const kept = DATA_POINTS.filter(p => p.y >= threshold);
  const filtered = DATA_POINTS.filter(p => p.y < threshold);
  const loss = lossAtThreshold(threshold);
  const LW = 280, LH = 120, LPAD = 35;

  const scaleX = (v: number) => PAD + (v / 100) * (W - PAD * 2);
  const scaleY = (v: number) => H - PAD - (v / 100) * (H - PAD * 2);
  const lossX = (i: number) => LPAD + (i / 4) * (LW - LPAD * 2);
  const lossY = (v: number) => LH - 20 - ((3.5 - v) / 3.0) * (LH - 40);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Quality vs. Quantity Tradeoff
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Adjust the quality threshold to see how filtering synthetic data affects training loss.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Data quality scatter</div>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, background: '#F5F0E6', borderRadius: '10px' }}>
            <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#D5CFC3" strokeWidth="1" />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#D5CFC3" strokeWidth="1" />
            <line x1={PAD} y1={scaleY(threshold)} x2={W - PAD} y2={scaleY(threshold)} stroke="#C76B4A" strokeWidth="1.5" strokeDasharray="4,3" />
            <text x={W - PAD + 2} y={scaleY(threshold) + 3} fill="#C76B4A" fontSize="8" fontFamily="'JetBrains Mono', monospace">{threshold}%</text>
            {filtered.map((p, i) => <circle key={`f${i}`} cx={scaleX(p.x)} cy={scaleY(p.y)} r="5" fill="#C76B4A" opacity="0.3" />)}
            {kept.map((p, i) => <circle key={`k${i}`} cx={scaleX(p.x)} cy={scaleY(p.y)} r="5" fill="#8BA888" opacity="0.85" />)}
            <text x={W / 2} y={H - 5} textAnchor="middle" fill="#8B9B8D" fontSize="9" fontFamily="'JetBrains Mono', monospace">Quantity</text>
            <text x={8} y={H / 2} textAnchor="middle" fill="#8B9B8D" fontSize="9" fontFamily="'JetBrains Mono', monospace" transform={`rotate(-90, 8, ${H / 2})`}>Quality</text>
          </svg>

          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#5A6B5C', fontWeight: 600 }}>Quality Threshold</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 700, color: '#C76B4A' }}>{threshold}%</span>
            </div>
            <input type="range" min={0} max={95} value={threshold} onChange={e => setThreshold(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#C76B4A' }} />
          </div>
        </div>

        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Training loss curve</div>
          <svg viewBox={`0 0 ${LW} ${LH}`} style={{ width: '100%', maxWidth: LW, background: '#F5F0E6', borderRadius: '10px' }}>
            <line x1={LPAD} y1={LH - 20} x2={LW - LPAD} y2={LH - 20} stroke="#D5CFC3" strokeWidth="1" />
            <line x1={LPAD} y1={10} x2={LPAD} y2={LH - 20} stroke="#D5CFC3" strokeWidth="1" />
            <polyline fill="none" stroke="#8BA888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              points={loss.map((v, i) => `${lossX(i)},${lossY(v)}`).join(' ')} />
            {loss.map((v, i) => <circle key={i} cx={lossX(i)} cy={lossY(v)} r="3.5" fill="#8BA888" />)}
            <text x={LW / 2} y={LH - 4} textAnchor="middle" fill="#8B9B8D" fontSize="8" fontFamily="'JetBrains Mono', monospace">Training steps</text>
            <text x={6} y={LH / 2} textAnchor="middle" fill="#8B9B8D" fontSize="8" fontFamily="'JetBrains Mono', monospace" transform={`rotate(-90, 6, ${LH / 2})`}>Loss</text>
          </svg>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
            <div style={{ background: '#F5F0E6', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#8BA888' }}>{kept.length}</div>
              <div style={{ fontSize: '0.68rem', color: '#8B9B8D', textTransform: 'uppercase' as const }}>Kept</div>
            </div>
            <div style={{ background: '#F5F0E6', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#C76B4A' }}>{filtered.length}</div>
              <div style={{ fontSize: '0.68rem', color: '#8B9B8D', textTransform: 'uppercase' as const }}>Filtered</div>
            </div>
            <div style={{ background: '#F5F0E6', borderRadius: '8px', padding: '0.6rem', textAlign: 'center', gridColumn: 'span 2' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#D4A843' }}>{loss[4].toFixed(2)}</div>
              <div style={{ fontSize: '0.68rem', color: '#8B9B8D', textTransform: 'uppercase' as const }}>Final loss</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
