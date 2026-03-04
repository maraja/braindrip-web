import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const STAGES = [
  {
    id: 'sft',
    title: 'Stage 1: Supervised Fine-Tuning',
    subtitle: 'Train on demonstration data',
    color: '#8BA888',
    detail: 'The base model is fine-tuned on high-quality (instruction, response) pairs written by human experts. This gives the model basic instruction-following ability.',
    flow: ['Base Model', 'Human Demos', 'SFT Model (π_SFT)'],
    metrics: [['Dataset', '~13K demos'], ['Epochs', '3'], ['LR', '2e-5']],
  },
  {
    id: 'rm',
    title: 'Stage 2: Reward Model Training',
    subtitle: 'Learn human preferences',
    color: '#D4A843',
    detail: 'For each prompt, the SFT model generates multiple responses. Human annotators rank them by quality. A reward model learns to predict these rankings using the Bradley-Terry preference model.',
    flow: ['Prompt → 2 Responses', 'Human Rankings', 'Reward Model (r_θ)'],
    metrics: [['Comparisons', '~33K pairs'], ['Agreement', '73%'], ['Accuracy', '69%']],
  },
  {
    id: 'ppo',
    title: 'Stage 3: PPO Optimization',
    subtitle: 'Optimize policy with KL constraint',
    color: '#C76B4A',
    detail: 'The SFT model is further trained using PPO (Proximal Policy Optimization). The reward model scores each response, but a KL divergence penalty prevents the policy from drifting too far from the SFT model.',
    flow: ['Policy (π_θ)', 'Reward - β·KL', 'Aligned Model'],
    metrics: [['KL coeff (β)', '0.02'], ['Batch size', '256'], ['PPO epochs', '4']],
  },
];

export default function RLHFPipelineVisualizer() {
  const [stage, setStage] = useState(0);
  const s = STAGES[stage];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          RLHF Pipeline Visualizer
        </h3>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '1.5rem' }}>
        {STAGES.map((st, i) => (
          <div key={st.id} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <button onClick={() => setStage(i)} style={{
              width: '36px', height: '36px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: i <= stage ? st.color : '#E5DFD3',
              color: i <= stage ? '#FDFBF7' : '#6B7B6E',
              fontWeight: 700, fontSize: '0.85rem', fontFamily: "'Source Sans 3', system-ui, sans-serif",
              transition: 'all 0.3s',
            }}>{i + 1}</button>
            {i < 2 && (
              <div style={{ flex: 1, height: '3px', background: i < stage ? STAGES[i + 1].color : '#E5DFD3', transition: 'background 0.3s' }} />
            )}
          </div>
        ))}
      </div>

      {/* Stage header */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.1rem', fontWeight: 600, color: s.color }}>{s.title}</div>
        <div style={{ fontSize: '0.82rem', color: '#6B7B6E' }}>{s.subtitle}</div>
      </div>

      {/* Data flow animation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        {s.flow.map((step, i) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              padding: '0.5rem 0.9rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
              background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}40`,
              fontFamily: "'JetBrains Mono', monospace",
            }}>{step}</div>
            {i < 2 && <span style={{ color: s.color, fontSize: '1.1rem', fontWeight: 700 }}>→</span>}
          </div>
        ))}
      </div>

      {/* Description */}
      <div style={{ background: 'rgba(44, 62, 45, 0.04)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.6 }}>{s.detail}</div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {s.metrics.map(([label, value]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: s.color }}>{value}</div>
            <div style={{ fontSize: '0.72rem', color: '#6B7B6E', marginTop: '0.15rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.2rem' }}>
        <button onClick={() => setStage(Math.max(0, stage - 1))} disabled={stage === 0} style={{
          padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid #E5DFD3', background: 'transparent',
          color: stage === 0 ? '#ccc' : '#2C3E2D', cursor: stage === 0 ? 'default' : 'pointer',
          fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.82rem',
        }}>← Previous</button>
        <button onClick={() => setStage(Math.min(2, stage + 1))} disabled={stage === 2} style={{
          padding: '0.4rem 1rem', borderRadius: '8px', border: 'none', cursor: stage === 2 ? 'default' : 'pointer',
          background: stage === 2 ? '#E5DFD3' : '#2C3E2D', color: '#FDFBF7',
          fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.82rem',
        }}>Next →</button>
      </div>
    </div>
  );
}
