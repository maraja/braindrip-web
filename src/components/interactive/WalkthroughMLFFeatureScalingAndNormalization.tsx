import { useState } from 'react';

const STEPS = [
    { title: '1. Standardization (Z-Score Normalization)', desc: 'Standardization centers each feature at zero mean and unit variance:  [equation]  where  = &#123;1&#125;&#123;n&#125;_&#123;i=1&#125;^n x_i is the sample mean and  = &#123;&#123;1&#125;&#123;n-1&#125;_&#123;i=1&#125;^n (x_i - )^2&#125; is the sample standard deviation. After transformation, x\' has mean  0 and standard deviation  1.' },
    { title: '2. Min-Max Normalization', desc: 'Min-max scaling maps values to a fixed range, typically [0, 1]:  [equation]  To scale to an arbitrary range [a, b]:  [equation]  When to use: When you need bounded outputs (e.g.' },
    { title: '3. Robust Scaling', desc: 'Robust scaling uses the median and interquartile range (IQR), which are resistant to outliers:  [equation]  where &#123;x&#125; is the median, Q_1 is the 25th percentile, and Q_3 is the 75th percentile.' },
    { title: '4. Log Transformation', desc: 'For right-skewed data spanning several orders of magnitude (income, population, word frequencies):  [equation]  The +1 handles zero values. Log transforms compress the upper tail and expand the lower range, often making the distribution more approximately normal.' },
    { title: '5. Box-Cox Transformation', desc: 'A generalized power transformation parameterized by :  [equation]  The optimal  is chosen to maximize the log-likelihood of the data being normally distributed. This subsumes the log transform ( = 0), square root ( = 0.5), and reciprocal ( = -1) as special cases.' },
    { title: '6. Implementation: Fit on Train, Transform on All', desc: 'A critical rule: compute scaling parameters (, , x_&#123;&#125;, x_&#123;&#125;, etc.) from the training set only, then apply those same parameters to validation and test sets.' },
];

export default function WalkthroughMLFFeatureScalingAndNormalization() {
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
          Feature Scaling and Normalization \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how feature scaling and normalization works, one stage at a time.
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
