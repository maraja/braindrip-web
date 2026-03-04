import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const steps = [
  { name: 'Input', desc: 'Token embedding enters the Mamba block', detail: 'Each token x(t) arrives as a d-dimensional vector.', color: '#5A6B5C' },
  { name: 'Linear Proj', desc: 'Expand to 2× dimension, split into two paths', detail: 'The input is projected up and split: one path goes to SSM, the other becomes a gate (via SiLU activation).', color: '#D4A843' },
  { name: 'Conv1D', desc: 'Local context via 1D convolution', detail: 'A small causal convolution (kernel=4) captures local patterns before SSM processing. This adds n-gram-like features.', color: '#C76B4A' },
  { name: 'Selective SSM', desc: 'Key innovation: input-dependent state transitions', detail: 'Unlike fixed SSMs, Mamba makes A, B, C matrices depend on the input. The model learns WHEN to remember and WHEN to forget — making selection data-dependent.', color: '#8BA888' },
  { name: 'Gate & Multiply', desc: 'Gated residual with the second path', detail: 'The SSM output is element-wise multiplied with the SiLU-gated branch. This controls information flow, similar to GLU in transformers.', color: '#6E8B6B' },
  { name: 'Output Proj', desc: 'Project back to model dimension', detail: 'A linear layer projects back to the original dimension d, producing the block output.', color: '#5A6B5C' },
];

export default function MambaBlockViz() {
  const [step, setStep] = useState(3);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Mamba Block Architecture</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Step through the selective state space mechanism that powers Mamba.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.15rem', marginBottom: '1rem', alignItems: 'center' }}>
        {steps.map((s, i) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', flex: 1 }}>
            <button onClick={() => setStep(i)} style={{
              flex: 1, padding: '0.4rem 0.2rem', borderRadius: '6px', textAlign: 'center',
              border: `2px solid ${step === i ? s.color : '#E5DFD3'}`, background: step === i ? s.color + '15' : '#F0EBE1',
              cursor: 'pointer', fontSize: '0.6rem', fontWeight: step === i ? 700 : 400, color: step === i ? s.color : '#7A8B7C',
            }}>{s.name}</button>
            {i < steps.length - 1 && <span style={{ color: '#D4C5A9', fontSize: '0.7rem' }}>→</span>}
          </div>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: steps[step].color, marginBottom: '0.3rem' }}>{steps[step].desc}</div>
        <div style={{ fontSize: '0.8rem', color: '#5A6B5C', lineHeight: 1.6 }}>{steps[step].detail}</div>
      </div>

      {step === 3 && (
        <div style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #8BA888', background: 'rgba(139,168,136,0.06)', marginBottom: '0.75rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#2C3E2D', lineHeight: 1.8 }}>
            <div>B(t) = Linear_B(x(t)) <span style={{ color: '#7A8B7C' }}>// input-dependent</span></div>
            <div>C(t) = Linear_C(x(t)) <span style={{ color: '#7A8B7C' }}>// input-dependent</span></div>
            <div>delta(t) = softplus(Linear_delta(x(t)))</div>
            <div>h(t) = exp(-delta*A) * h(t-1) + delta*B(t) * x(t)</div>
            <div>y(t) = C(t) * h(t)</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: step === 0 ? '#D4C5A9' : '#5A6B5C', cursor: step === 0 ? 'default' : 'pointer', fontSize: '0.78rem' }}>← Prev</button>
        <span style={{ fontSize: '0.72rem', color: '#7A8B7C', alignSelf: 'center' }}>{step + 1}/{steps.length}</span>
        <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: step === steps.length - 1 ? '#D4C5A9' : '#5A6B5C', cursor: step === steps.length - 1 ? 'default' : 'pointer', fontSize: '0.78rem' }}>Next →</button>
      </div>
    </div>
  );
}
