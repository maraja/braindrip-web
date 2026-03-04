import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const problems = [
  { name: 'Simple Math', difficulty: 'Easy', baseAccuracy: 90, computeSensitivity: 0.05 },
  { name: 'Logic Puzzle', difficulty: 'Medium', baseAccuracy: 55, computeSensitivity: 0.25 },
  { name: 'Olympiad Problem', difficulty: 'Hard', baseAccuracy: 15, computeSensitivity: 0.40 },
];

export default function ComputeBudgetAllocation() {
  const [budget, setBudget] = useState(100);
  const [allocs, setAllocs] = useState([20, 30, 50]);

  const updateAlloc = (idx: number, val: number) => {
    const newA = [...allocs];
    const diff = val - newA[idx];
    newA[idx] = val;
    const others = [0, 1, 2].filter(i => i !== idx);
    const otherTotal = others.reduce((s, i) => s + newA[i], 0);
    if (otherTotal > 0) {
      others.forEach(i => { newA[i] = Math.max(0, Math.round(newA[i] - diff * (newA[i] / otherTotal))); });
    }
    setAllocs(newA);
  };

  const getAccuracy = (idx: number) => {
    const p = problems[idx];
    return Math.min(99, Math.round(p.baseAccuracy + allocs[idx] * p.computeSensitivity));
  };

  const avgAccuracy = Math.round(problems.reduce((s, _, i) => s + getAccuracy(i), 0) / 3);
  const diffColors = { Easy: '#8BA888', Medium: '#D4A843', Hard: '#C76B4A' };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Compute Budget Allocation</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Allocate {budget} compute units across problems of varying difficulty.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
        {problems.map((p, i) => (
          <div key={p.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2C3E2D' }}>{p.name}</span>
              <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: diffColors[p.difficulty as keyof typeof diffColors] + '20', color: diffColors[p.difficulty as keyof typeof diffColors], fontWeight: 600 }}>{p.difficulty}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="range" min={0} max={budget} value={allocs[i]} onChange={e => updateAlloc(i, +e.target.value)}
                style={{ flex: 1, accentColor: diffColors[p.difficulty as keyof typeof diffColors] }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#2C3E2D', width: '30px', textAlign: 'right' }}>{allocs[i]}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.15rem' }}>
              <span style={{ fontSize: '0.6rem', color: '#7A8B7C' }}>Base: {p.baseAccuracy}%</span>
              <span style={{ fontSize: '0.68rem', fontFamily: "'JetBrains Mono', monospace", color: diffColors[p.difficulty as keyof typeof diffColors], fontWeight: 600 }}>→ {getAccuracy(i)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const }}>Average Accuracy</div>
          <div style={{ fontSize: '0.72rem', color: '#5A6B5C', marginTop: '0.1rem' }}>Hard problems benefit most from extra compute</div>
        </div>
        <div style={{ fontSize: '1.4rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: avgAccuracy > 70 ? '#8BA888' : '#D4A843' }}>{avgAccuracy}%</div>
      </div>
    </div>
  );
}
