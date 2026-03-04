import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const METHODS = [
  {
    name: 'Fine-tuning', color: '#D4A843',
    desc: 'Retrain the model on a dataset that excludes the data to forget, hoping the model updates its weights.',
    memory: 35, accuracy: 85, speed: 70, cost: 80,
    pros: ['Simple to implement', 'Preserves most model capabilities'],
    cons: ['Incomplete forgetting — traces often remain', 'Expensive for large models', 'May need multiple rounds'],
  },
  {
    name: 'Gradient Ascent', color: '#C76B4A',
    desc: 'Increase the loss on data to be forgotten (reverse of gradient descent), pushing the model away from that knowledge.',
    memory: 15, accuracy: 70, speed: 85, cost: 60,
    pros: ['Targeted — directly acts on forget set', 'Relatively fast'],
    cons: ['Can damage neighboring knowledge', 'Catastrophic forgetting of related concepts', 'Difficult to calibrate'],
  },
  {
    name: 'Influence Functions', color: '#8BA888',
    desc: 'Mathematically estimate each training example\'s influence on the model, then remove the influence of targeted examples.',
    memory: 10, accuracy: 90, speed: 30, cost: 40,
    pros: ['Precise and principled', 'Minimal collateral damage'],
    cons: ['Computationally expensive for large models', 'Approximations may be inaccurate', 'Requires access to training data'],
  },
  {
    name: 'Knowledge Distillation', color: '#6E8B6B',
    desc: 'Train a new "student" model from a "teacher" that has been filtered to exclude target knowledge.',
    memory: 5, accuracy: 80, speed: 20, cost: 30,
    pros: ['Clean separation — new model never saw the data', 'Verifiable'],
    cons: ['Requires training a new model from scratch', 'Most expensive approach', 'Student may not match teacher quality'],
  },
];

export default function UnlearningMethodViz() {
  const [methodIdx, setMethodIdx] = useState(0);
  const method = METHODS[methodIdx];

  const Metric = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div style={{ flex: 1, textAlign: 'center' as const }}>
      <div style={{ fontSize: '0.72rem', color: '#8B9B8D', marginBottom: '0.3rem', fontWeight: 600 }}>{label}</div>
      <div style={{ height: '60px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <div style={{ width: '24px', height: `${value * 0.6}px`, background: color, borderRadius: '4px 4px 0 0', transition: 'height 0.4s' }} />
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color, marginTop: '0.2rem' }}>{value}%</div>
    </div>
  );

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Machine Unlearning Methods</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare approaches to making a model forget specific knowledge.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' as const }}>
        {METHODS.map((m, i) => (
          <button key={i} onClick={() => setMethodIdx(i)} style={{
            padding: '0.4rem 0.7rem', borderRadius: '8px', border: `1px solid ${methodIdx === i ? m.color : '#E5DFD3'}`,
            background: methodIdx === i ? `${m.color}10` : 'transparent', cursor: 'pointer',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
            color: methodIdx === i ? m.color : '#5A6B5C',
          }}>{m.name}</button>
        ))}
      </div>

      <div style={{ fontSize: '0.85rem', color: '#5A6B5C', marginBottom: '1rem', lineHeight: 1.6 }}>{method.desc}</div>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', padding: '0.75rem', background: '#F5F0E6', borderRadius: '10px' }}>
        <Metric label="Memory Left" value={method.memory} color={method.memory < 20 ? '#8BA888' : '#C76B4A'} />
        <Metric label="Accuracy" value={method.accuracy} color={method.accuracy > 80 ? '#8BA888' : '#D4A843'} />
        <Metric label="Speed" value={method.speed} color={method.speed > 60 ? '#8BA888' : '#D4A843'} />
        <Metric label="Cost Eff." value={method.cost} color={method.cost > 60 ? '#8BA888' : '#D4A843'} />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <div style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', background: '#8BA88808', border: '1px solid #8BA88815' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8BA888', marginBottom: '0.3rem', textTransform: 'uppercase' as const }}>Pros</div>
          {method.pros.map((p, i) => (
            <div key={i} style={{ fontSize: '0.78rem', color: '#2C3E2D', marginBottom: '0.15rem', paddingLeft: '0.5rem', borderLeft: '2px solid #8BA888' }}>{p}</div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', background: '#C76B4A08', border: '1px solid #C76B4A15' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#C76B4A', marginBottom: '0.3rem', textTransform: 'uppercase' as const }}>Cons</div>
          {method.cons.map((c, i) => (
            <div key={i} style={{ fontSize: '0.78rem', color: '#2C3E2D', marginBottom: '0.15rem', paddingLeft: '0.5rem', borderLeft: '2px solid #C76B4A' }}>{c}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
