import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

function seededRandom(seed: number) {
  const x = Math.sin(seed * 7919 + 104729) * 49.71;
  return x - Math.floor(x);
}

const PROMPTS = [
  { text: 'Solve: What is 17 x 23?', answer: '391', groupSize: 8 },
  { text: 'Write a haiku about the ocean.', answer: null, groupSize: 8 },
  { text: 'Explain why the sky is blue.', answer: null, groupSize: 8 },
];

function generateGroup(promptIdx: number, n: number) {
  return Array.from({ length: n }, (_, i) => {
    const score = seededRandom(promptIdx * 100 + i * 13 + 7) * 0.8 + 0.1;
    return { id: i + 1, score: parseFloat(score.toFixed(3)) };
  });
}

export default function GRPOGroupScoring() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [step, setStep] = useState(0);

  const prompt = PROMPTS[promptIdx];
  const group = generateGroup(promptIdx, prompt.groupSize);
  const mean = group.reduce((s, r) => s + r.score, 0) / group.length;
  const std = Math.sqrt(group.reduce((s, r) => s + (r.score - mean) ** 2, 0) / group.length);
  const advantages = group.map(r => ({
    ...r,
    advantage: std > 0 ? parseFloat(((r.score - mean) / std).toFixed(3)) : 0,
  }));

  const steps = ['Generate Group', 'Score Each', 'Compute Advantages', 'Update Policy'];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          GRPO: Group Relative Policy Optimization
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Step through how GRPO scores a group of responses and computes advantages without a critic model.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {PROMPTS.map((p, i) => (
          <button key={i} onClick={() => { setPromptIdx(i); setStep(0); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px',
            border: `1px solid ${promptIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: promptIdx === i ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
            color: promptIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: promptIdx === i ? 600 : 400,
            fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
          }}>
            Prompt {i + 1}
          </button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Prompt</div>
        <div style={{ fontSize: '0.82rem', color: '#2C3E2D', fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>{prompt.text}</div>
      </div>

      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem' }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, padding: '0.4rem 0.3rem', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 600,
            border: `1px solid ${step >= i ? '#8BA888' : '#E5DFD3'}`,
            background: step === i ? 'rgba(139, 168, 136, 0.15)' : step > i ? 'rgba(139, 168, 136, 0.06)' : 'transparent',
            color: step >= i ? '#2C3E2D' : '#7A8B7C', cursor: 'pointer',
          }}>
            {i + 1}. {s}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.35rem', marginBottom: '1rem' }}>
        {advantages.map((r) => (
          <div key={r.id} style={{
            background: step >= 2 && r.advantage > 0 ? 'rgba(139, 168, 136, 0.12)' : '#F0EBE1',
            borderRadius: '6px', padding: '0.45rem 0.5rem', textAlign: 'center',
            border: step >= 2 && r.advantage > 0.5 ? '1px solid #8BA888' : '1px solid transparent',
            opacity: step >= 1 ? 1 : 0.5, transition: 'all 0.3s ease',
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600 }}>R{r.id}</div>
            {step >= 1 && (
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#2C3E2D', fontWeight: 600, marginTop: '0.15rem' }}>
                {r.score}
              </div>
            )}
            {step >= 2 && (
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', marginTop: '0.15rem',
                color: r.advantage > 0 ? '#8BA888' : '#C76B4A', fontWeight: 600,
              }}>
                {r.advantage > 0 ? '+' : ''}{r.advantage}
              </div>
            )}
          </div>
        ))}
      </div>

      {step >= 2 && (
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#5A6B5C', textAlign: 'center' }}>
            A_i = (r_i - mean) / std = (r_i - {mean.toFixed(3)}) / {std.toFixed(3)}
          </div>
        </div>
      )}

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem 1rem' }}>
        <div style={{ fontSize: '0.7rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.4rem' }}>
          Key Insight: No Critic Model
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(199, 107, 74, 0.06)' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#C76B4A' }}>PPO</div>
            <div style={{ fontSize: '0.7rem', color: '#5A6B5C' }}>Needs a separate critic/value network to estimate advantages</div>
          </div>
          <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.1)' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#8BA888' }}>GRPO</div>
            <div style={{ fontSize: '0.7rem', color: '#5A6B5C' }}>Computes advantages from group statistics (mean, std) directly</div>
          </div>
        </div>
      </div>
    </div>
  );
}
