import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const SCENARIOS = [
  {
    name: 'Text Classification',
    models: [
      { label: 'Weak Model', accuracy: 65, color: '#C76B4A', desc: 'Small model used as supervisor. Makes labeling mistakes, especially on ambiguous examples.' },
      { label: 'Naive Strong', accuracy: 72, color: '#D4A843', desc: 'Large model trained purely on weak model\'s labels. Learns both signal and noise from the supervisor.' },
      { label: 'Weak-to-Strong', accuracy: 87, color: '#8BA888', desc: 'Large model with auxiliary confidence loss that helps it identify and override supervisor errors.' },
      { label: 'Ground Truth', accuracy: 93, color: '#2C3E2D', desc: 'Large model trained on human-verified labels. This is the ceiling — the best we could achieve with perfect supervision.' },
    ],
  },
  {
    name: 'Reward Modeling',
    models: [
      { label: 'Weak RM', accuracy: 58, color: '#C76B4A', desc: 'Small reward model providing preference labels. Has systematic biases toward length and confidence.' },
      { label: 'Naive Strong RM', accuracy: 68, color: '#D4A843', desc: 'Large RM trained on weak preferences. Inherits biases but improves on clear-cut cases.' },
      { label: 'Weak-to-Strong RM', accuracy: 81, color: '#8BA888', desc: 'Large RM trained to generalize past weak labels using consistency regularization across paraphrases.' },
      { label: 'Oracle RM', accuracy: 91, color: '#2C3E2D', desc: 'Large RM with expert human labels. Represents ideal alignment signal quality.' },
    ],
  },
];

export default function SupervisionGapDemo() {
  const [scenIdx, setScenIdx] = useState(0);
  const [selectedModel, setSelectedModel] = useState(-1);
  const scen = SCENARIOS[scenIdx];

  const switchScen = (i: number) => { setScenIdx(i); setSelectedModel(-1); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Supervision Gap</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare performance across supervision approaches: weak, naive, weak-to-strong, and ground truth.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {SCENARIOS.map((s, i) => (
          <button key={i} onClick={() => switchScen(i)} style={{
            flex: 1, padding: '0.5rem', borderRadius: '8px', border: `1px solid ${scenIdx === i ? '#2C3E2D' : '#E5DFD3'}`,
            background: scenIdx === i ? '#2C3E2D08' : 'transparent', cursor: 'pointer', textAlign: 'center' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.82rem', fontWeight: 600,
            color: scenIdx === i ? '#2C3E2D' : '#5A6B5C',
          }}>{s.name}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem', marginBottom: '1rem' }}>
        {scen.models.map((m, i) => (
          <button key={i} onClick={() => setSelectedModel(selectedModel === i ? -1 : i)} style={{
            padding: '0.65rem 0.85rem', borderRadius: '8px', border: `1px solid ${selectedModel === i ? m.color + '66' : '#E5DFD3'}`,
            background: selectedModel === i ? `${m.color}08` : 'transparent', cursor: 'pointer', textAlign: 'left' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: m.color }}>{m.label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 700, color: m.color }}>{m.accuracy}%</span>
            </div>
            <div style={{ height: '10px', background: '#E5DFD3', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${m.accuracy}%`, background: m.color, borderRadius: '5px', transition: 'width 0.5s' }} />
            </div>
            {selectedModel === i && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#5A6B5C', lineHeight: 1.6 }}>{m.desc}</div>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', background: '#F5F0E6', textAlign: 'center' as const }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', fontWeight: 700, color: '#C76B4A' }}>{scen.models[3].accuracy - scen.models[0].accuracy}</div>
          <div style={{ fontSize: '0.68rem', color: '#5A6B5C' }}>Full Gap</div>
        </div>
        <div style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', background: '#8BA88810', textAlign: 'center' as const }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', fontWeight: 700, color: '#8BA888' }}>{scen.models[2].accuracy - scen.models[0].accuracy}</div>
          <div style={{ fontSize: '0.68rem', color: '#5A6B5C' }}>Recovered</div>
        </div>
        <div style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', background: '#D4A84310', textAlign: 'center' as const }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', fontWeight: 700, color: '#D4A843' }}>{scen.models[3].accuracy - scen.models[2].accuracy}</div>
          <div style={{ fontSize: '0.68rem', color: '#5A6B5C' }}>Remaining Gap</div>
        </div>
      </div>
    </div>
  );
}
