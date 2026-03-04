import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const NF4_LEVELS = [-1.0, -0.6962, -0.5251, -0.3949, -0.2844, -0.1848, -0.0911, 0.0,
  0.0796, 0.1609, 0.2461, 0.3379, 0.4407, 0.5626, 0.7230, 1.0];
const INT4_LEVELS = Array.from({ length: 16 }, (_, i) => -1 + (2 * i) / 15);

const gaussian = (x: number) => Math.exp(-0.5 * x * x * 4) / Math.sqrt(2 * Math.PI);
const CURVE_POINTS = 200;

export default function NF4QuantizationViz() {
  const [mode, setMode] = useState<'nf4' | 'int4'>('nf4');
  const [hovered, setHovered] = useState<number | null>(null);

  const levels = mode === 'nf4' ? NF4_LEVELS : INT4_LEVELS;
  const W = 420, H = 180;
  const xScale = (v: number) => ((v + 1.2) / 2.4) * (W - 40) + 30;
  const yScale = (v: number) => H - 20 - (v / 0.85) * (H - 40);

  const curvePath = Array.from({ length: CURVE_POINTS }, (_, i) => {
    const x = -1.2 + (2.4 * i) / (CURVE_POINTS - 1);
    const y = gaussian(x);
    return `${i === 0 ? 'M' : 'L'}${xScale(x)},${yScale(y)}`;
  }).join(' ');

  const densityNear = (v: number) => {
    const idx = levels.indexOf(v);
    if (idx <= 0 || idx >= levels.length - 1) return 0;
    return 1 / (levels[idx + 1] - levels[idx - 1]);
  };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          NF4 vs INT4 Quantization
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(['nf4', 'int4'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '0.5rem 1.2rem', borderRadius: '8px', border: `1.5px solid ${mode === m ? (m === 'nf4' ? '#C76B4A' : '#8BA888') : '#E5DFD3'}`,
            background: mode === m ? (m === 'nf4' ? 'rgba(199,107,74,0.06)' : 'rgba(139,168,136,0.06)') : '#FDFBF7',
            cursor: 'pointer', fontSize: '0.85rem', fontWeight: mode === m ? 600 : 400,
            color: mode === m ? (m === 'nf4' ? '#C76B4A' : '#2C3E2D') : '#5A6B5C',
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>
            {m === 'nf4' ? 'NF4 (NormalFloat4)' : 'Uniform INT4'}
          </button>
        ))}
      </div>

      <div style={{ background: 'rgba(44,62,45,0.03)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: '520px', display: 'block', margin: '0 auto' }}>
          <defs>
            <linearGradient id="bellFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={mode === 'nf4' ? '#C76B4A' : '#8BA888'} stopOpacity="0.12" />
              <stop offset="100%" stopColor={mode === 'nf4' ? '#C76B4A' : '#8BA888'} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <line x1={30} y1={H - 20} x2={W - 10} y2={H - 20} stroke="#E5DFD3" strokeWidth={1} />
          <line x1={xScale(0)} y1={15} x2={xScale(0)} y2={H - 20} stroke="#E5DFD3" strokeWidth={0.5} strokeDasharray="3,3" />

          <path d={`${curvePath} L${xScale(1.2)},${H - 20} L${xScale(-1.2)},${H - 20} Z`} fill="url(#bellFill)" />
          <path d={curvePath} fill="none" stroke={mode === 'nf4' ? '#C76B4A' : '#8BA888'} strokeWidth={2} />

          {levels.map((v, i) => {
            const x = xScale(v);
            const isHov = hovered === i;
            return (
              <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
                <line x1={x} y1={H - 20} x2={x} y2={H - 35} stroke={mode === 'nf4' ? '#C76B4A' : '#8BA888'}
                  strokeWidth={isHov ? 2.5 : 1.5} opacity={isHov ? 1 : 0.7} />
                <circle cx={x} cy={H - 35} r={isHov ? 4 : 2.5}
                  fill={mode === 'nf4' ? '#C76B4A' : '#8BA888'} stroke="#FDFBF7" strokeWidth={1} />
                {isHov && (
                  <text x={x} y={H - 42} textAnchor="middle" fontSize={8} fill="#2C3E2D" fontWeight={600}
                    fontFamily="'JetBrains Mono', monospace">{v.toFixed(4)}</text>
                )}
              </g>
            );
          })}

          <text x={W / 2} y={H - 3} textAnchor="middle" fontSize={8} fill="#5A6B5C">Weight value</text>
          <text x={15} y={H / 2} textAnchor="middle" fontSize={8} fill="#5A6B5C" transform={`rotate(-90, 15, ${H / 2})`}>Density</text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: mode === 'nf4' ? 'rgba(199,107,74,0.06)' : 'rgba(44,62,45,0.03)', borderRadius: '8px', padding: '0.75rem', transition: 'all 0.3s' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#C76B4A', marginBottom: '0.3rem' }}>NF4 Advantage</div>
          <div style={{ fontSize: '0.8rem', color: '#5A6B5C', lineHeight: 1.5 }}>
            Levels placed to give equal probability mass per bin, matching the normal distribution of neural network weights.
          </div>
        </div>
        <div style={{ background: mode === 'int4' ? 'rgba(139,168,136,0.08)' : 'rgba(44,62,45,0.03)', borderRadius: '8px', padding: '0.75rem', transition: 'all 0.3s' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#8BA888', marginBottom: '0.3rem' }}>INT4 Limitation</div>
          <div style={{ fontSize: '0.8rem', color: '#5A6B5C', lineHeight: 1.5 }}>
            Uniform spacing wastes levels in the tails where few weights exist, and under-represents the dense center.
          </div>
        </div>
      </div>

      <div style={{ padding: '0.6rem', background: 'rgba(212,168,67,0.08)', borderRadius: '8px', fontSize: '0.8rem', color: '#5A6B5C', lineHeight: 1.5 }}>
        Information-theoretic insight: NF4 is optimal for normally-distributed data because each quantization bin captures equal probability mass (~6.25%). This minimizes the expected quantization error, achieving theoretically optimal 4-bit representation for neural network weights.
      </div>
    </div>
  );
}
