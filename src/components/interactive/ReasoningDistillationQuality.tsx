import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const benchmarks: Record<string, { teacher: number; student: number; distilled: number; label: string }> = {
  math: { teacher: 92, student: 61, distilled: 87, label: 'GSM8K (Math)' },
  coding: { teacher: 88, student: 54, distilled: 82, label: 'HumanEval (Code)' },
  commonsense: { teacher: 95, student: 78, distilled: 91, label: 'ARC (Reasoning)' },
};

const models = [
  { key: 'teacher', label: 'Teacher (70B)', size: '70B params', speed: '~12 tok/s', cost: '$$$', color: '#C76B4A' },
  { key: 'student', label: 'Student (7B)', size: '7B params', speed: '~85 tok/s', cost: '$', color: '#D4A843' },
  { key: 'distilled', label: 'Distilled (7B)', size: '7B params', speed: '~80 tok/s', cost: '$', color: '#8BA888' },
];

export default function ReasoningDistillationQuality() {
  const [benchmark, setBenchmark] = useState<'math' | 'coding' | 'commonsense'>('math');

  const data = benchmarks[benchmark];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Reasoning Distillation Quality
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Distilled small models can approach teacher-level reasoning at a fraction of the cost.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {(Object.keys(benchmarks) as Array<keyof typeof benchmarks>).map(b => (
          <button key={b} onClick={() => setBenchmark(b as any)} style={{
            padding: '0.35rem 0.75rem', borderRadius: '6px',
            border: `1px solid ${benchmark === b ? '#C76B4A' : '#E5DFD3'}`,
            background: benchmark === b ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
            color: benchmark === b ? '#C76B4A' : '#5A6B5C',
            fontWeight: benchmark === b ? 600 : 400,
            fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
            textTransform: 'capitalize',
          }}>
            {b}
          </button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {data.label} — Accuracy (%)
        </div>
        {models.map(m => {
          const score = data[m.key as keyof typeof data] as number;
          return (
            <div key={m.key} style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D' }}>{m.label}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>{score}%</span>
              </div>
              <div style={{ height: '10px', background: '#E5DFD3', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${score}%`, height: '100%', background: m.color, borderRadius: '5px', transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.68rem', color: '#7A8B7C' }}>Size: {m.size}</span>
                <span style={{ fontSize: '0.68rem', color: '#7A8B7C' }}>Speed: {m.speed}</span>
                <span style={{ fontSize: '0.68rem', color: '#7A8B7C' }}>Cost: {m.cost}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Quality Recovery</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#8BA888', fontFamily: "'JetBrains Mono', monospace" }}>
            {Math.round(((data.distilled - data.student) / (data.teacher - data.student)) * 100)}%
          </div>
          <div style={{ fontSize: '0.7rem', color: '#5A6B5C' }}>of teacher gap closed</div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Cost Reduction</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#C76B4A', fontFamily: "'JetBrains Mono', monospace" }}>~10x</div>
          <div style={{ fontSize: '0.7rem', color: '#5A6B5C' }}>cheaper than teacher</div>
        </div>
      </div>
    </div>
  );
}
