import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const MODELS = [
  { name: '125M', params: 0.125, color: '#C76B4A' },
  { name: '350M', params: 0.35, color: '#D4A843' },
  { name: '1.3B', params: 1.3, color: '#8BA888' },
  { name: '6.7B', params: 6.7, color: '#5A8B7C' },
  { name: '13B', params: 13, color: '#6E8B6B' },
  { name: '70B', params: 70, color: '#2C3E2D' },
];

const DATASETS: Record<string, { name: string; perplexities: number[] }> = {
  wiki: { name: 'Wikipedia', perplexities: [35.2, 26.8, 18.4, 12.1, 9.8, 7.2] },
  books: { name: 'Books', perplexities: [42.5, 31.3, 21.6, 14.8, 11.9, 8.9] },
  code: { name: 'Code', perplexities: [58.1, 40.2, 25.7, 16.3, 12.8, 9.1] },
  web: { name: 'Web Text', perplexities: [38.9, 28.7, 19.8, 13.5, 10.6, 7.8] },
};

const DATASET_KEYS = Object.keys(DATASETS);

export default function PerplexityModelComparison() {
  const [dataset, setDataset] = useState('wiki');
  const [logScale, setLogScale] = useState(true);
  const [hoveredModel, setHoveredModel] = useState<number | null>(null);

  const ds = DATASETS[dataset];
  const maxPPL = Math.max(...ds.perplexities);
  const minPPL = Math.min(...ds.perplexities);

  const svgW = 340, svgH = 200, padL = 45, padR = 15, padT = 15, padB = 35;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const toX = (params: number) => {
    const logMin = Math.log10(0.1);
    const logMax = Math.log10(100);
    return padL + ((Math.log10(params) - logMin) / (logMax - logMin)) * plotW;
  };

  const toY = (ppl: number) => {
    if (logScale) {
      const logMin = Math.log10(5);
      const logMax = Math.log10(70);
      return padT + plotH - ((Math.log10(ppl) - logMin) / (logMax - logMin)) * plotH;
    }
    return padT + plotH - ((ppl - 5) / (70 - 5)) * plotH;
  };

  const pathD = MODELS.map((m, i) => {
    const x = toX(m.params);
    const y = toY(ds.perplexities[i]);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  const improvement = ((ds.perplexities[0] - ds.perplexities[5]) / ds.perplexities[0] * 100).toFixed(0);
  const lastJump = ((ds.perplexities[4] - ds.perplexities[5]) / ds.perplexities[4] * 100).toFixed(0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Perplexity vs. Model Scale
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          See how perplexity decreases with model size. Note the diminishing returns at larger scales.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {DATASET_KEYS.map(k => (
          <button key={k} onClick={() => setDataset(k)} style={{
            padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer',
            border: `1px solid ${dataset === k ? '#C76B4A' : '#E5DFD3'}`,
            background: dataset === k ? 'rgba(199,107,74,0.08)' : 'transparent',
            color: dataset === k ? '#C76B4A' : '#5A6B5C', fontWeight: dataset === k ? 600 : 400,
          }}>
            {DATASETS[k].name}
          </button>
        ))}
        <label style={{ fontSize: '0.72rem', color: '#5A6B5C', marginLeft: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <input type="checkbox" checked={logScale} onChange={() => setLogScale(!logScale)} />
          Log scale
        </label>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH}>
          {/* Grid lines */}
          {(logScale ? [7, 10, 15, 20, 30, 50] : [10, 20, 30, 40, 50, 60]).map(v => (
            <g key={v}>
              <line x1={padL} y1={toY(v)} x2={svgW - padR} y2={toY(v)} stroke="#E5DFD3" strokeWidth="0.5" />
              <text x={padL - 5} y={toY(v)} textAnchor="end" dominantBaseline="middle" fontSize="7" fill="#999">{v}</text>
            </g>
          ))}
          {/* X-axis labels */}
          {MODELS.map(m => (
            <text key={m.name} x={toX(m.params)} y={svgH - padB + 14} textAnchor="middle" fontSize="7" fill="#7A8B7C">{m.name}</text>
          ))}
          <text x={svgW / 2} y={svgH - 3} textAnchor="middle" fontSize="8" fill="#7A8B7C">Model Parameters</text>
          <text x={8} y={svgH / 2} textAnchor="middle" fontSize="8" fill="#7A8B7C" transform={`rotate(-90, 8, ${svgH / 2})`}>Perplexity</text>
          {/* Line */}
          <path d={pathD} fill="none" stroke="#8BA888" strokeWidth="2" />
          {/* Data points */}
          {MODELS.map((m, i) => {
            const x = toX(m.params);
            const y = toY(ds.perplexities[i]);
            return (
              <g key={m.name} onMouseEnter={() => setHoveredModel(i)} onMouseLeave={() => setHoveredModel(null)} style={{ cursor: 'pointer' }}>
                <circle cx={x} cy={y} r={hoveredModel === i ? 6 : 4} fill={m.color} stroke={hoveredModel === i ? '#2C3E2D' : 'none'} strokeWidth="1.5" />
                {hoveredModel === i && (
                  <text x={x} y={y - 10} textAnchor="middle" fontSize="8" fill="#2C3E2D" fontWeight="600">
                    PPL: {ds.perplexities[i].toFixed(1)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Best PPL</div>
          <div style={{ fontSize: '1.1rem', fontFamily: "'JetBrains Mono', monospace", color: '#8BA888', fontWeight: 700 }}>
            {minPPL.toFixed(1)}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#5A6B5C' }}>70B model</div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Total Reduction</div>
          <div style={{ fontSize: '1.1rem', fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', fontWeight: 700 }}>
            {improvement}%
          </div>
          <div style={{ fontSize: '0.65rem', color: '#5A6B5C' }}>125M to 70B</div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Last 5x Scale</div>
          <div style={{ fontSize: '1.1rem', fontFamily: "'JetBrains Mono', monospace", color: '#D4A843', fontWeight: 700 }}>
            {lastJump}%
          </div>
          <div style={{ fontSize: '0.65rem', color: '#5A6B5C' }}>Diminishing returns</div>
        </div>
      </div>
    </div>
  );
}
