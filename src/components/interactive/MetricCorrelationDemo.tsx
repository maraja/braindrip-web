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
  { bleu: 0.85, human: 4.5, text: 'Accurate translation with natural phrasing', outlier: false },
  { bleu: 0.72, human: 4.2, text: 'Good translation, slight word reordering', outlier: false },
  { bleu: 0.55, human: 3.8, text: 'Decent meaning, different word choices', outlier: false },
  { bleu: 0.35, human: 2.5, text: 'Partial meaning captured, some errors', outlier: false },
  { bleu: 0.15, human: 1.0, text: 'Poor quality, meaning mostly lost', outlier: false },
  { bleu: 0.78, human: 1.5, text: 'High n-gram overlap but wrong meaning (false positive)', outlier: true },
  { bleu: 0.12, human: 4.8, text: 'Excellent paraphrase with no word overlap (false negative)', outlier: true },
  { bleu: 0.65, human: 4.0, text: 'Good summary, moderate overlap', outlier: false },
  { bleu: 0.42, human: 3.2, text: 'Acceptable quality, limited overlap', outlier: false },
  { bleu: 0.82, human: 2.0, text: 'Copied words but garbled grammar (false positive)', outlier: true },
  { bleu: 0.25, human: 4.3, text: 'Creative rewording, captures nuance (false negative)', outlier: true },
  { bleu: 0.60, human: 3.5, text: 'Reasonable quality, typical overlap', outlier: false },
];

const METRICS = ['BLEU', 'ROUGE-L', 'BERTScore'] as const;

export default function MetricCorrelationDemo() {
  const [selected, setSelected] = useState<number | null>(null);
  const [metric, setMetric] = useState<typeof METRICS[number]>('BLEU');
  const [showOutliers, setShowOutliers] = useState(true);

  const getAutoScore = (d: typeof DATA_POINTS[0]) => {
    if (metric === 'BLEU') return d.bleu;
    if (metric === 'ROUGE-L') return Math.min(1, d.bleu + 0.08 + (d.outlier ? -0.05 : 0.03));
    return Math.min(1, d.human / 5.5 + 0.05);
  };

  const filtered = showOutliers ? DATA_POINTS : DATA_POINTS.filter(d => !d.outlier);
  const correlation = (() => {
    const n = filtered.length;
    const xs = filtered.map(d => getAutoScore(d));
    const ys = filtered.map(d => d.human);
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
    const dx = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0));
    const dy = Math.sqrt(ys.reduce((s, y) => s + (y - my) ** 2, 0));
    return dx * dy > 0 ? num / (dx * dy) : 0;
  })();

  const svgW = 300, svgH = 220, pad = 35;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Metric vs. Human Judgment Correlation
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Explore where automatic metrics agree or disagree with human ratings. Outliers reveal metric failures.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {METRICS.map(m => (
          <button key={m} onClick={() => { setMetric(m); setSelected(null); }} style={{
            padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer',
            border: `1px solid ${metric === m ? '#C76B4A' : '#E5DFD3'}`,
            background: metric === m ? 'rgba(199,107,74,0.08)' : 'transparent',
            color: metric === m ? '#C76B4A' : '#5A6B5C', fontWeight: metric === m ? 600 : 400,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {m}
          </button>
        ))}
        <label style={{ fontSize: '0.72rem', color: '#5A6B5C', marginLeft: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <input type="checkbox" checked={showOutliers} onChange={() => setShowOutliers(!showOutliers)} />
          Show outliers
        </label>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', background: '#F0EBE1', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH}>
            <line x1={pad} y1={svgH - pad} x2={svgW - 10} y2={svgH - pad} stroke="#E5DFD3" strokeWidth="1" />
            <line x1={pad} y1={10} x2={pad} y2={svgH - pad} stroke="#E5DFD3" strokeWidth="1" />
            <text x={svgW / 2} y={svgH - 5} textAnchor="middle" fontSize="8" fill="#7A8B7C">{metric} Score</text>
            <text x={10} y={svgH / 2} textAnchor="middle" fontSize="8" fill="#7A8B7C" transform={`rotate(-90, 10, ${svgH / 2})`}>Human Rating</text>
            {[0, 0.25, 0.5, 0.75, 1].map(v => (
              <text key={'x' + v} x={pad + v * (svgW - pad - 10)} y={svgH - pad + 12} textAnchor="middle" fontSize="7" fill="#999">{v.toFixed(1)}</text>
            ))}
            {[0, 1, 2, 3, 4, 5].map(v => (
              <text key={'y' + v} x={pad - 5} y={svgH - pad - (v / 5) * (svgH - pad - 10)} textAnchor="end" dominantBaseline="middle" fontSize="7" fill="#999">{v}</text>
            ))}
            {/* Trend line */}
            <line x1={pad} y1={svgH - pad - 0.2 * (svgH - pad - 10)} x2={svgW - 10} y2={svgH - pad - 0.9 * (svgH - pad - 10)} stroke="#8BA888" strokeWidth="1" strokeDasharray="4,3" opacity={0.6} />
            {filtered.map((d, i) => {
              const x = pad + getAutoScore(d) * (svgW - pad - 10);
              const y = svgH - pad - (d.human / 5) * (svgH - pad - 10);
              return (
                <circle key={i} cx={x} cy={y} r={selected === i ? 6 : 4}
                  fill={d.outlier ? '#C76B4A' : '#8BA888'} stroke={selected === i ? '#2C3E2D' : 'none'} strokeWidth="1.5"
                  opacity={selected === null || selected === i ? 0.85 : 0.3}
                  style={{ cursor: 'pointer' }} onClick={() => setSelected(selected === i ? null : i)} />
              );
            })}
          </svg>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Correlation (r)</div>
            <div style={{ fontSize: '1.4rem', fontFamily: "'JetBrains Mono', monospace", color: correlation > 0.7 ? '#8BA888' : '#C76B4A', fontWeight: 700 }}>
              {correlation.toFixed(3)}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#5A6B5C' }}>
              {correlation > 0.85 ? 'Strong correlation with human judgment' : correlation > 0.7 ? 'Moderate correlation -- some disagreements' : 'Weak correlation -- metric misses important quality aspects'}
            </div>
          </div>
          {selected !== null && (
            <div style={{ background: filtered[selected].outlier ? 'rgba(199,107,74,0.08)' : '#F0EBE1', borderRadius: '8px', padding: '0.75rem', border: filtered[selected].outlier ? '1px solid rgba(199,107,74,0.3)' : '1px solid transparent' }}>
              <div style={{ fontSize: '0.75rem', color: '#2C3E2D', fontWeight: 500, marginBottom: '0.3rem' }}>{filtered[selected].text}</div>
              <div style={{ fontSize: '0.68rem', color: '#5A6B5C' }}>
                {metric}: <strong>{getAutoScore(filtered[selected]).toFixed(2)}</strong> | Human: <strong>{filtered[selected].human.toFixed(1)}</strong>
              </div>
              {filtered[selected].outlier && (
                <div style={{ fontSize: '0.68rem', color: '#C76B4A', marginTop: '0.25rem', fontWeight: 500 }}>
                  {getAutoScore(filtered[selected]) > 0.5 ? 'False positive: high metric score despite poor quality' : 'False negative: low metric score despite good quality'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
