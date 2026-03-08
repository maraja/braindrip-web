import { useState } from 'react';

const STEPS = [
    { title: '1. Supervised Learning', desc: 'Given a dataset &#123;D&#125; = \\&#123;(x_i, y_i)\\&#125;_&#123;i=1&#125;^n where x_i  &#123;X&#125; are inputs and y_i  &#123;Y&#125; are labels, the goal is to learn f: &#123;X&#125;  &#123;Y&#125; that generalizes to unseen data. Classification: &#123;Y&#125; is a discrete set of categories.' },
    { title: '2. Unsupervised Learning', desc: 'Given only &#123;D&#125; = \\&#123;x_i\\&#125;_&#123;i=1&#125;^n with no labels, the goal is to discover hidden structure. Clustering: Partition data into groups.' },
    { title: '3. Semi-Supervised Learning', desc: 'You have a small labeled set &#123;D&#125;_l = \\&#123;(x_i, y_i)\\&#125;_&#123;i=1&#125;^l and a large unlabeled set &#123;D&#125;_u = \\&#123;x_j\\&#125;_&#123;j=1&#125;^u where u  l. The key assumption is that the structure of p(x) -- revealed by unlabeled data -- contains information about p(y|x).' },
    { title: '4. Self-Supervised Learning', desc: 'The model generates its own supervision from the data through pretext tasks -- artificially constructed prediction problems. The key idea: design a task where the labels come for free from the data itself.' },
    { title: '5. Transfer Learning', desc: 'A model trained on task A (source) is adapted to task B (target), typically with less data. The assumption is that low-level features learned on A are useful for B.' },
    { title: '6. Online Learning', desc: 'Data arrives sequentially, and the model updates incrementally. At each round t, the learner predicts &#123;y&#125;_t, observes the true y_t, and updates.' },
];

export default function WalkthroughMLFTypesOfMachineLearning() {
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
          Types of Machine Learning \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how types of machine learning works, one stage at a time.
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
