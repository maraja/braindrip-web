import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const standardSteps = [
  { label: 'Teacher output', detail: 'Softmax distribution over vocab', color: '#8BA888' },
  { label: 'Soft targets', detail: 'P("Paris")=0.7, P("Lyon")=0.15, ...', color: '#8BA888' },
  { label: 'Student learns', detail: 'Match token probability distribution', color: '#8BA888' },
];

const reasoningSteps = [
  { label: 'Teacher reasons', detail: 'Generate chain-of-thought trace', color: '#C76B4A' },
  { label: 'Trace captured', detail: '"The capital of France... Paris is the largest city and seat of government..."', color: '#C76B4A' },
  { label: 'Student learns', detail: 'Replicate reasoning process, not just answer', color: '#C76B4A' },
];

const comparisons = [
  { aspect: 'What is transferred', standard: 'Token probabilities', reasoning: 'Reasoning traces' },
  { aspect: 'Training signal', standard: 'KL divergence on logits', reasoning: 'Supervised on CoT steps' },
  { aspect: 'Student capability', standard: 'Mimics outputs', reasoning: 'Mimics thinking process' },
  { aspect: 'On novel problems', standard: 'Often fails', reasoning: 'Can generalize reasoning' },
];

export default function DistillationForReasoningViz() {
  const [mode, setMode] = useState<'standard' | 'reasoning'>('standard');
  const [step, setStep] = useState(0);

  const steps = mode === 'standard' ? standardSteps : reasoningSteps;
  const accent = mode === 'standard' ? '#8BA888' : '#C76B4A';

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Standard vs Reasoning Distillation
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Compare how standard distillation transfers outputs while reasoning distillation transfers the thinking process.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(['standard', 'reasoning'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setStep(0); }} style={{
            padding: '0.4rem 0.85rem', borderRadius: '6px',
            border: `1px solid ${mode === m ? accent : '#E5DFD3'}`,
            background: mode === m ? `${accent}12` : 'transparent',
            color: mode === m ? accent : '#5A6B5C',
            fontWeight: mode === m ? 600 : 400,
            fontSize: '0.82rem', cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {m} distillation
          </button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: `${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
            {mode === 'standard' ? '📊' : '🧠'}
          </div>
          <div>
            <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, color: '#2C3E2D', fontSize: '1rem' }}>
              {mode === 'standard' ? 'Standard: Match What the Teacher Says' : 'Reasoning: Match How the Teacher Thinks'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#5A6B5C', marginTop: '0.2rem' }}>
              {mode === 'standard' ? 'Student learns to produce similar output distributions' : 'Student learns to reproduce the chain-of-thought reasoning'}
            </div>
          </div>
        </div>

        {steps.map((s, i) => (
          <div key={i} onClick={() => setStep(i)} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem',
            background: step === i ? '#FDFBF7' : 'transparent', borderRadius: '8px',
            cursor: 'pointer', marginBottom: '0.35rem', transition: 'background 0.2s',
            border: step === i ? `1px solid ${accent}40` : '1px solid transparent',
          }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
              background: i <= step ? accent : '#D4CFC4', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, transition: 'background 0.3s',
            }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D' }}>{s.label}</div>
              <div style={{ fontSize: '0.72rem', color: '#5A6B5C', fontFamily: "'JetBrains Mono', monospace" }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
        Comparison
      </div>
      <div style={{ display: 'grid', gap: '0.4rem' }}>
        {comparisons.map(c => (
          <div key={c.aspect} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', padding: '0.5rem 0.6rem', background: '#F0EBE1', borderRadius: '6px', fontSize: '0.75rem' }}>
            <span style={{ color: '#7A8B7C', fontWeight: 600 }}>{c.aspect}</span>
            <span style={{ color: mode === 'standard' ? '#2C3E2D' : '#5A6B5C', fontWeight: mode === 'standard' ? 600 : 400 }}>{c.standard}</span>
            <span style={{ color: mode === 'reasoning' ? '#2C3E2D' : '#5A6B5C', fontWeight: mode === 'reasoning' ? 600 : 400 }}>{c.reasoning}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
