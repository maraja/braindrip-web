import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const dataPoints = [
  { compute: 1, perf: 30 }, { compute: 2, perf: 42 }, { compute: 4, perf: 53 },
  { compute: 8, perf: 62 }, { compute: 16, perf: 70 }, { compute: 32, perf: 76 },
  { compute: 64, perf: 81 }, { compute: 128, perf: 85 }, { compute: 256, perf: 88 },
  { compute: 512, perf: 90 }, { compute: 1024, perf: 92 },
];

export default function InferenceScalingCurve() {
  const [selectedPoint, setSelectedPoint] = useState(5);
  const chartW = 300;
  const chartH = 120;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Inference Scaling Curve</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Performance scales log-linearly with inference compute.</p>
      </div>

      <div style={{ position: 'relative', margin: '0 auto', width: chartW + 60, height: chartH + 40 }}>
        <div style={{ position: 'absolute', left: 0, bottom: 20, fontSize: '0.55rem', color: '#7A8B7C', transform: 'rotate(-90deg)', transformOrigin: 'left bottom' }}>Performance %</div>
        <svg width={chartW + 40} height={chartH + 30} style={{ marginLeft: 20 }}>
          {[0, 25, 50, 75, 100].map(v => (
            <g key={v}>
              <line x1={20} y1={chartH - v * chartH / 100} x2={chartW + 20} y2={chartH - v * chartH / 100} stroke="#E5DFD3" strokeWidth={0.5} />
              <text x={16} y={chartH - v * chartH / 100 + 3} textAnchor="end" fontSize={8} fill="#7A8B7C">{v}</text>
            </g>
          ))}
          <polyline fill="none" stroke="#8BA888" strokeWidth={2}
            points={dataPoints.map((d, i) => `${20 + (i / (dataPoints.length - 1)) * chartW},${chartH - d.perf * chartH / 100}`).join(' ')} />
          {dataPoints.map((d, i) => (
            <circle key={i} cx={20 + (i / (dataPoints.length - 1)) * chartW} cy={chartH - d.perf * chartH / 100}
              r={selectedPoint === i ? 5 : 3} fill={selectedPoint === i ? '#C76B4A' : '#8BA888'}
              style={{ cursor: 'pointer' }} onClick={() => setSelectedPoint(i)} />
          ))}
          <text x={chartW / 2 + 20} y={chartH + 22} textAnchor="middle" fontSize={9} fill="#7A8B7C">Inference Compute (log scale)</text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.75rem' }}>
        <div style={{ padding: '0.5rem', background: '#F0EBE1', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.55rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600 }}>Compute</div>
          <div style={{ fontSize: '0.95rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#C76B4A' }}>{dataPoints[selectedPoint].compute}x</div>
        </div>
        <div style={{ padding: '0.5rem', background: '#F0EBE1', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.55rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600 }}>Performance</div>
          <div style={{ fontSize: '0.95rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#8BA888' }}>{dataPoints[selectedPoint].perf}%</div>
        </div>
        <div style={{ padding: '0.5rem', background: '#F0EBE1', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.55rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600 }}>Marginal Gain</div>
          <div style={{ fontSize: '0.95rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#D4A843' }}>
            {selectedPoint > 0 ? `+${dataPoints[selectedPoint].perf - dataPoints[selectedPoint - 1].perf}%` : '--'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#7A8B7C', textAlign: 'center' }}>
        Diminishing returns: 2x compute = ~{selectedPoint > 0 ? dataPoints[selectedPoint].perf - dataPoints[selectedPoint - 1].perf : 12}% improvement at this scale
      </div>
    </div>
  );
}
