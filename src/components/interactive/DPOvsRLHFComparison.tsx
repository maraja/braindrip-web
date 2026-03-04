import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const PIPELINES = {
  rlhf: {
    name: 'RLHF',
    steps: [
      { title: 'Step 1: Reward Model', desc: 'Train a separate reward model on human preference data (chosen vs rejected pairs).', cost: 'High', icon: '1' },
      { title: 'Step 2: RL Training', desc: 'Use PPO to optimize the policy against the learned reward model.', cost: 'Very High', icon: '2' },
      { title: 'Step 3: KL Regularization', desc: 'Constrain the policy to stay close to the reference model using KL penalty.', cost: 'Medium', icon: '3' },
    ],
    complexity: 'High', compute: '3-4x base', memory: '4 models in memory', stability: 'Fragile -- reward hacking, mode collapse risk',
  },
  dpo: {
    name: 'DPO',
    steps: [
      { title: 'Single Step: Direct Optimization', desc: 'Directly optimize the policy on preference pairs using the closed-form DPO loss. No reward model needed.', cost: 'Low', icon: '1' },
    ],
    complexity: 'Low', compute: '1-1.5x base', memory: '2 models (policy + reference)', stability: 'Stable -- standard cross-entropy-style loss',
  },
};

const METRICS = [
  { label: 'Training Complexity', rlhf: 'High (3 stages)', dpo: 'Low (1 stage)', advantage: 'dpo' },
  { label: 'Compute Cost', rlhf: '3-4x base training', dpo: '1-1.5x base training', advantage: 'dpo' },
  { label: 'Memory (models loaded)', rlhf: '4 (policy, ref, reward, critic)', dpo: '2 (policy, reference)', advantage: 'dpo' },
  { label: 'Training Stability', rlhf: 'Fragile', dpo: 'Stable', advantage: 'dpo' },
  { label: 'Reward Generalization', rlhf: 'Explicit reward model', dpo: 'Implicit (no separate RM)', advantage: 'rlhf' },
  { label: 'Online Exploration', rlhf: 'Yes (generates new samples)', dpo: 'No (offline only)', advantage: 'rlhf' },
];

export default function DPOvsRLHFComparison() {
  const [view, setView] = useState<'rlhf' | 'dpo' | 'compare'>('compare');

  const pipeline = view !== 'compare' ? PIPELINES[view] : null;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          DPO vs RLHF Pipeline Comparison
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Compare training pipelines: DPO eliminates the reward model and RL loop entirely.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {(['rlhf', 'dpo', 'compare'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px',
            border: `1px solid ${view === v ? '#C76B4A' : '#E5DFD3'}`,
            background: view === v ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
            color: view === v ? '#C76B4A' : '#5A6B5C',
            fontWeight: view === v ? 600 : 400,
            fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
          }}>
            {v === 'compare' ? 'Side-by-Side' : v.toUpperCase()}
          </button>
        ))}
      </div>

      {view === 'compare' ? (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
            {METRICS.map(m => (
              <div key={m.label} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.5rem', background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem', alignItems: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2C3E2D' }}>{m.label}</div>
                <div style={{
                  fontSize: '0.72rem', color: m.advantage === 'rlhf' ? '#8BA888' : '#5A6B5C',
                  fontWeight: m.advantage === 'rlhf' ? 600 : 400,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>RLHF: {m.rlhf}</div>
                <div style={{
                  fontSize: '0.72rem', color: m.advantage === 'dpo' ? '#8BA888' : '#5A6B5C',
                  fontWeight: m.advantage === 'dpo' ? 600 : 400,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>DPO: {m.dpo}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {['RLHF', 'DPO'].map((name, i) => (
              <div key={name} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.3rem' }}>Memory footprint</div>
                <div style={{ height: '14px', background: '#E5DFD3', borderRadius: '7px', overflow: 'hidden' }}>
                  <div style={{ width: i === 0 ? '100%' : '50%', height: '100%', background: i === 0 ? '#C76B4A' : '#8BA888', borderRadius: '7px', transition: 'width 0.3s' }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: '#5A6B5C', marginTop: '0.2rem', fontFamily: "'JetBrains Mono', monospace" }}>{name}: {i === 0 ? '4 models' : '2 models'}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            {pipeline!.steps.map((step, i) => (
              <div key={i} style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.8rem 1rem', borderLeft: `3px solid ${view === 'dpo' ? '#8BA888' : '#C76B4A'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', background: view === 'dpo' ? '#8BA888' : '#C76B4A', color: '#fff', fontSize: '0.65rem', fontWeight: 700 }}>{step.icon}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2C3E2D' }}>{step.title}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#5A6B5C', margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
            {[
              { label: 'Complexity', val: pipeline!.complexity },
              { label: 'Compute', val: pipeline!.compute },
              { label: 'Memory', val: pipeline!.memory },
              { label: 'Stability', val: pipeline!.stability },
            ].map(m => (
              <div key={m.label} style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
                <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{m.label}</div>
                <div style={{ fontSize: '0.8rem', color: '#2C3E2D', fontWeight: 500, marginTop: '0.2rem' }}>{m.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
