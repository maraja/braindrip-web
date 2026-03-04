import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const RANKS = [1, 2, 4, 8, 16, 32, 64, 128, 256];
const TASKS = [
  { name: 'Sentiment Classification', color: '#8BA888', icon: '💬', scores: [82, 89, 93, 95, 96, 96.5, 96.7, 96.8, 96.8], note: 'Simple tasks saturate at low rank' },
  { name: 'Named Entity Recognition', color: '#D4A843', icon: '🏷', scores: [60, 70, 79, 85, 89, 91, 92, 92.5, 92.5], note: 'Moderate complexity, saturates around r=32' },
  { name: 'Code Generation', color: '#C76B4A', icon: '⌨', scores: [30, 40, 50, 60, 68, 75, 80, 83, 85], note: 'Complex tasks benefit from higher rank' },
  { name: 'Math Reasoning', color: '#6E8B6B', icon: '∑', scores: [20, 28, 38, 48, 56, 63, 69, 74, 78], note: 'Most complex tasks need the most capacity' },
];

const CHART_W = 400;
const CHART_H = 200;

export default function LoRARankExplorer() {
  const [hovered, setHovered] = useState<{ task: number; rank: number } | null>(null);
  const [activeTasks, setActiveTasks] = useState<boolean[]>(TASKS.map(() => true));

  const xScale = (i: number) => (i / (RANKS.length - 1)) * (CHART_W - 40) + 30;
  const yScale = (v: number) => CHART_H - 20 - ((v - 10) / 95) * (CHART_H - 40);

  const toggleTask = (idx: number) => {
    const next = [...activeTasks];
    next[idx] = !next[idx];
    setActiveTasks(next);
  };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          LoRA Rank vs Task Performance
        </h3>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem', marginBottom: '1rem' }}>
        {TASKS.map((t, i) => (
          <button key={t.name} onClick={() => toggleTask(i)} style={{
            padding: '0.3rem 0.75rem', borderRadius: '14px', border: `1.5px solid ${t.color}`,
            background: activeTasks[i] ? `${t.color}18` : 'transparent', cursor: 'pointer',
            fontSize: '0.78rem', color: activeTasks[i] ? t.color : '#999', fontWeight: activeTasks[i] ? 600 : 400,
            fontFamily: "'Source Sans 3', system-ui, sans-serif", transition: 'all 0.2s',
            opacity: activeTasks[i] ? 1 : 0.5,
          }}>
            {t.name}
          </button>
        ))}
      </div>

      <div style={{ background: 'rgba(44,62,45,0.03)', borderRadius: '10px', padding: '1rem', position: 'relative' as const }}>
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} style={{ width: '100%', maxWidth: '500px', display: 'block', margin: '0 auto' }}>
          {[20, 40, 60, 80, 100].map(v => (
            <g key={v}>
              <line x1={30} y1={yScale(v)} x2={CHART_W - 10} y2={yScale(v)} stroke="#E5DFD3" strokeWidth={0.5} />
              <text x={25} y={yScale(v) + 3} textAnchor="end" fontSize={8} fill="#999">{v}</text>
            </g>
          ))}
          {RANKS.map((r, i) => (
            <text key={r} x={xScale(i)} y={CHART_H - 5} textAnchor="middle" fontSize={7} fill="#999">{r}</text>
          ))}
          <text x={CHART_W / 2} y={CHART_H + 2} textAnchor="middle" fontSize={8} fill="#5A6B5C">Rank (r)</text>
          <text x={6} y={CHART_H / 2} textAnchor="middle" fontSize={8} fill="#5A6B5C" transform={`rotate(-90, 6, ${CHART_H / 2})`}>Score</text>

          {TASKS.map((task, ti) => activeTasks[ti] && (
            <g key={task.name}>
              <polyline fill="none" stroke={task.color} strokeWidth={2} strokeLinejoin="round"
                points={task.scores.map((s, i) => `${xScale(i)},${yScale(s)}`).join(' ')} />
              {task.scores.map((s, i) => (
                <circle key={i} cx={xScale(i)} cy={yScale(s)} r={hovered?.task === ti && hovered?.rank === i ? 5 : 3}
                  fill={task.color} stroke="#FDFBF7" strokeWidth={1.5} style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                  onMouseEnter={() => setHovered({ task: ti, rank: i })} onMouseLeave={() => setHovered(null)} />
              ))}
            </g>
          ))}
        </svg>

        {hovered && (
          <div style={{
            position: 'absolute' as const, top: '0.5rem', right: '0.5rem', background: '#FDFBF7', border: '1px solid #E5DFD3',
            borderRadius: '8px', padding: '0.6rem 0.8rem', fontSize: '0.8rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontWeight: 600, color: TASKS[hovered.task].color, marginBottom: '0.2rem' }}>{TASKS[hovered.task].name}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D' }}>
              Rank {RANKS[hovered.rank]} → {TASKS[hovered.task].scores[hovered.rank]}%
            </div>
            {hovered.rank > 0 && (
              <div style={{ fontSize: '0.7rem', color: '#5A6B5C', marginTop: '0.2rem' }}>
                +{(TASKS[hovered.task].scores[hovered.rank] - TASKS[hovered.task].scores[hovered.rank - 1]).toFixed(1)} from rank {RANKS[hovered.rank - 1]}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '1rem', padding: '0.6rem', background: 'rgba(212,168,67,0.08)', borderRadius: '8px', fontSize: '0.8rem', color: '#5A6B5C', lineHeight: 1.5 }}>
        Diminishing returns: Simple tasks (sentiment) saturate at r=4-8, while complex tasks (math, code) continue to improve at higher ranks. Most practitioners find r=8-16 is the sweet spot balancing quality and efficiency.
      </div>
    </div>
  );
}
