import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const BENCHMARKS = ['MMLU', 'HumanEval', 'GSM8K', 'HellaSwag', 'TruthfulQA', 'ARC'];
const MODELS = [
  { name: 'GPT-4o', color: '#C76B4A', scores: [88.7, 90.2, 95.8, 95.3, 64.0, 96.4] },
  { name: 'Claude 3.5', color: '#8BA888', scores: [88.7, 92.0, 96.4, 95.4, 66.2, 96.7] },
  { name: 'Gemini 1.5', color: '#D4A843', scores: [85.9, 79.1, 94.4, 92.1, 58.3, 94.0] },
  { name: 'LLaMA-3 70B', color: '#7A8B9C', scores: [82.0, 81.7, 93.0, 88.0, 54.8, 93.0] },
  { name: 'Mixtral 8x7B', color: '#A67C94', scores: [70.6, 40.2, 74.4, 84.4, 46.8, 85.6] },
];

export default function BenchmarkLeaderboardViz() {
  const [sortBy, setSortBy] = useState(0);
  const [activeModels, setActiveModels] = useState<Set<number>>(new Set([0, 1, 2, 3, 4]));

  const toggleModel = (i: number) => {
    const next = new Set(activeModels);
    if (next.has(i)) { if (next.size > 1) next.delete(i); } else next.add(i);
    setActiveModels(next);
  };

  const sorted = [...MODELS.map((m, i) => ({ ...m, idx: i }))]
    .filter((_, i) => activeModels.has(i))
    .sort((a, b) => b.scores[sortBy] - a.scores[sortBy]);

  const radarPoints = (scores: number[], cx: number, cy: number, r: number) => {
    return scores.map((s, i) => {
      const angle = (Math.PI * 2 * i) / scores.length - Math.PI / 2;
      const dist = (s / 100) * r;
      return `${cx + dist * Math.cos(angle)},${cy + dist * Math.sin(angle)}`;
    }).join(' ');
  };

  const cx = 120, cy = 110, r = 80;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Benchmark Leaderboard
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Sort by different benchmarks and toggle models to compare strengths and weaknesses.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {MODELS.map((m, i) => (
          <button key={m.name} onClick={() => toggleModel(i)} style={{
            padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem',
            border: `1px solid ${activeModels.has(i) ? m.color : '#E5DFD3'}`,
            background: activeModels.has(i) ? m.color + '15' : 'transparent',
            color: activeModels.has(i) ? m.color : '#999', fontWeight: activeModels.has(i) ? 600 : 400,
          }}>
            {activeModels.has(i) ? '\u25CF ' : '\u25CB '}{m.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 280px', background: '#F0EBE1', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.65rem', color: '#7A8B7C', alignSelf: 'center', marginRight: '0.3rem' }}>Sort by:</span>
            {BENCHMARKS.map((bm, i) => (
              <button key={bm} onClick={() => setSortBy(i)} style={{
                padding: '0.2rem 0.45rem', borderRadius: '4px', fontSize: '0.65rem', cursor: 'pointer',
                border: `1px solid ${sortBy === i ? '#C76B4A' : '#E5DFD3'}`,
                background: sortBy === i ? 'rgba(199,107,74,0.08)' : 'transparent',
                color: sortBy === i ? '#C76B4A' : '#7A8B7C', fontFamily: "'JetBrains Mono', monospace",
              }}>
                {bm}
              </button>
            ))}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.3rem 0.4rem', color: '#7A8B7C', fontWeight: 600, fontSize: '0.65rem', borderBottom: '1px solid #E5DFD3' }}>#</th>
                <th style={{ textAlign: 'left', padding: '0.3rem 0.4rem', color: '#7A8B7C', fontWeight: 600, fontSize: '0.65rem', borderBottom: '1px solid #E5DFD3' }}>Model</th>
                <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#C76B4A', fontWeight: 600, fontSize: '0.65rem', borderBottom: '1px solid #E5DFD3' }}>{BENCHMARKS[sortBy]}</th>
                <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#7A8B7C', fontWeight: 600, fontSize: '0.65rem', borderBottom: '1px solid #E5DFD3' }}>Avg</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m, rank) => (
                <tr key={m.name}>
                  <td style={{ padding: '0.3rem 0.4rem', color: '#7A8B7C', fontFamily: "'JetBrains Mono', monospace" }}>{rank + 1}</td>
                  <td style={{ padding: '0.3rem 0.4rem', color: '#2C3E2D', fontWeight: 500 }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: m.color, marginRight: '0.4rem' }} />
                    {m.name}
                  </td>
                  <td style={{ padding: '0.3rem 0.4rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', fontWeight: 600 }}>{m.scores[sortBy].toFixed(1)}</td>
                  <td style={{ padding: '0.3rem 0.4rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", color: '#5A6B5C' }}>{(m.scores.reduce((a, b) => a + b, 0) / m.scores.length).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ flex: '0 0 260px', background: '#F0EBE1', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#7A8B7C', marginBottom: '0.3rem', fontWeight: 600 }}>Radar View</div>
          <svg viewBox="0 0 240 230" width="240" height="230">
            {[20, 40, 60, 80].map(pct => (
              <polygon key={pct} points={radarPoints(Array(6).fill(pct), cx, cy, r)} fill="none" stroke="#E5DFD3" strokeWidth="0.5" />
            ))}
            {BENCHMARKS.map((bm, i) => {
              const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
              const lx = cx + (r + 16) * Math.cos(angle);
              const ly = cy + (r + 16) * Math.sin(angle);
              return <text key={bm} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="#7A8B7C">{bm}</text>;
            })}
            {sorted.map(m => (
              <polygon key={m.name} points={radarPoints(m.scores, cx, cy, r)} fill={m.color + '20'} stroke={m.color} strokeWidth="1.5" />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
