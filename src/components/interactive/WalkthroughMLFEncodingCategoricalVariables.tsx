import { useState } from 'react';

const STEPS = [
    { title: '1. Label Encoding (Integer Encoding)', desc: 'Label encoding assigns each category an integer: (c_i) = i. If colors are \\&#123;red, green, blue\\&#125;, the encoding might be red  0, green  1, blue  2.' },
    { title: '2. One-Hot Encoding', desc: 'One-hot encoding maps each category to a binary vector of length k with a single 1:  [equation]  For colors: red  [1, 0, 0], green  [0, 1, 0], blue  [0, 0, 1]. This ensures that all categories are equidistant: \\_2 = &#123;2&#125; for i  j.' },
    { title: '3. Target Encoding (Mean Encoding)', desc: 'Target encoding replaces each category with the mean of the target variable for that category:  [equation]  where S_i = \\&#123;j : X_j = c_i\\&#125; is the set of observations with category c_i.' },
    { title: '4. Binary Encoding', desc: 'Binary encoding converts the integer label to binary representation and uses each bit as a separate feature. For k categories, this produces  _2 k  columns instead of k.' },
    { title: '5. Feature Hashing (The Hashing Trick)', desc: 'Apply a hash function h: &#123;C&#125;  \\&#123;0, 1, , m-1\\&#125; to map categories to a fixed-size feature vector of length m, where m  k:  [equation]  Hash collisions mean multiple categories map to the same bucket, introducing some noise.' },
    { title: '6. Embedding Encoding', desc: 'Learned dense representations map each category to a low-dimensional continuous vector (c_i)  &#123;R&#125;^d where d  k. The embedding matrix E  &#123;R&#125;^&#123;k x d&#125; is trained end-to-end with the model (common in deep learning).' },
];

export default function WalkthroughMLFEncodingCategoricalVariables() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive Walkthrough</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Encoding Categorical Variables \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how encoding categorical variables works, one stage at a time.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem' }}>
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i <= step ? '#C76B4A' : '#E5DFD3',
            border: 'none', cursor: 'pointer', transition: 'background 0.2s ease',
          }} />
        ))}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.05rem', fontWeight: 600, color: '#2C3E2D', margin: '0 0 0.4rem 0' }}>
          {current.title}
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: 0 }}>
          {current.desc}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
          padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid #E5DFD3',
          background: step === 0 ? '#F5F0E8' : '#FDFBF7', color: step === 0 ? '#B0A898' : '#5A6B5C',
          fontSize: '0.8rem', cursor: step === 0 ? 'default' : 'pointer', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          &#8592; Previous
        </button>
        <span style={{ fontSize: '0.75rem', color: '#7A8B7C', fontFamily: "'JetBrains Mono', monospace" }}>
          {step + 1} / {STEPS.length}
        </span>
        <button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1} style={{
          padding: '0.4rem 1rem', borderRadius: '6px',
          border: `1px solid ${step === STEPS.length - 1 ? '#E5DFD3' : '#C76B4A'}`,
          background: step === STEPS.length - 1 ? '#F5F0E8' : 'rgba(199, 107, 74, 0.08)',
          color: step === STEPS.length - 1 ? '#B0A898' : '#C76B4A',
          fontSize: '0.8rem', fontWeight: 500, cursor: step === STEPS.length - 1 ? 'default' : 'pointer',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          Next &#8594;
        </button>
      </div>
    </div>
  );
}
