import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const TASKS = [
  {
    name: 'Code Quality Review',
    weakAccuracy: 62,
    strongCeiling: 95,
    naiveStrong: 78,
    weakToStrong: 88,
    explanation: 'The weak model (GPT-2 scale) labels code as good/bad. A strong model (GPT-4 scale) trained on these imperfect labels recovers much of its own ability, exceeding its weak supervisor by 26 points.',
  },
  {
    name: 'Natural Language Inference',
    weakAccuracy: 58,
    strongCeiling: 92,
    naiveStrong: 71,
    weakToStrong: 84,
    explanation: 'Despite being trained on noisy labels from a weaker model, the strong model leverages its superior representations to generalize beyond its supervisor\'s mistakes.',
  },
  {
    name: 'Ethical Reasoning',
    weakAccuracy: 55,
    strongCeiling: 90,
    naiveStrong: 65,
    weakToStrong: 76,
    explanation: 'Ethical reasoning shows a smaller generalization gap — the strong model recovers less of its ceiling compared to more clear-cut tasks, suggesting alignment is harder for subjective judgments.',
  },
];

export default function WeakToStrongViz() {
  const [taskIdx, setTaskIdx] = useState(0);
  const task = TASKS[taskIdx];
  const pgr = ((task.weakToStrong - task.weakAccuracy) / (task.strongCeiling - task.weakAccuracy) * 100).toFixed(0);

  const Bar = ({ label, value, color, maxWidth }: { label: string; value: number; color: string; maxWidth?: number }) => (
    <div style={{ marginBottom: '0.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D' }}>{label}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: '14px', background: '#E5DFD3', borderRadius: '7px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '7px', transition: 'width 0.5s' }} />
      </div>
    </div>
  );

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Weak-to-Strong Generalization</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>A weak supervisor trains a strong model — the strong model can exceed its teacher.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {TASKS.map((t, i) => (
          <button key={i} onClick={() => setTaskIdx(i)} style={{
            flex: 1, padding: '0.45rem', borderRadius: '8px', border: `1px solid ${taskIdx === i ? '#2C3E2D' : '#E5DFD3'}`,
            background: taskIdx === i ? '#2C3E2D08' : 'transparent', cursor: 'pointer', textAlign: 'center' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
            color: taskIdx === i ? '#2C3E2D' : '#5A6B5C',
          }}>{t.name}</button>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Bar label="Weak Model (supervisor)" value={task.weakAccuracy} color="#C76B4A" />
        <Bar label="Naive Strong (trained on weak labels)" value={task.naiveStrong} color="#D4A843" />
        <Bar label="Weak-to-Strong (with generalization)" value={task.weakToStrong} color="#8BA888" />
        <Bar label="Strong Ceiling (with ground truth)" value={task.strongCeiling} color="#2C3E2D" />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', background: '#8BA88810', border: '1px solid #8BA88833', textAlign: 'center' as const }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.2rem', fontWeight: 700, color: '#8BA888' }}>{pgr}%</div>
          <div style={{ fontSize: '0.72rem', color: '#5A6B5C' }}>Performance Gap Recovered</div>
        </div>
        <div style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', background: '#D4A84310', border: '1px solid #D4A84333', textAlign: 'center' as const }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.2rem', fontWeight: 700, color: '#D4A843' }}>+{task.weakToStrong - task.weakAccuracy}</div>
          <div style={{ fontSize: '0.72rem', color: '#5A6B5C' }}>Points Above Supervisor</div>
        </div>
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '0.85rem', fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>{task.explanation}</div>
    </div>
  );
}
