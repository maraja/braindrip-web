import { useState } from 'react';

const STEPS = [
    { title: '1. Why Comparing Means Is Not Enough', desc: 'Suppose 5-fold CV produces accuracy estimates for two models:  Mean: A = 0.850, B = 0.850. Yet looking fold-by-fold, sometimes A wins, sometimes B wins.' },
    { title: '2. Paired t-Test on CV Folds', desc: 'The most straightforward approach: compute the difference d_k = L_A^&#123;(k)&#125; - L_B^&#123;(k)&#125; for each fold k, then test whether the mean difference &#123;d&#125; is significantly different from zero. [equation]  where s_d is the standard deviation of the d_k values and K is the number of folds.' },
    { title: '3. Corrected Resampled t-Test (Nadeau & Bengio)', desc: 'Nadeau & Bengio (2003) proposed a correction that adjusts the variance estimate to account for the training set overlap:  [equation]  where n_&#123;test&#125; and n_&#123;train&#125; are the sizes of the test and training sets in each fold, and &#123;&#125;^2 is the variance of the fold-level differences:  [equation]  This.' },
    { title: '4. McNemar\'s Test (Classification)', desc: 'McNemar\'s test operates on the predictions themselves rather than on aggregate metrics. It uses a 2x2 contingency table of how two classifiers differ on individual test examples:  Only the discordant pairs (n_&#123;01&#125; and n_&#123;10&#125;) carry information about which model is better.' },
    { title: '5. Wilcoxon Signed-Rank Test (Non-Parametric)', desc: 'When fold-level differences are not normally distributed, the Wilcoxon signed-rank test is a robust alternative. It ranks the absolute differences [equation] values from smallest to largest.' },
    { title: '6. Friedman Test (Comparing Multiple Models)', desc: 'When comparing M &gt; 2 models across K datasets (or folds), the Friedman test is a non-parametric alternative to repeated-measures ANOVA. For each fold, models are ranked from best to worst.' },
];

export default function WalkthroughMLFModelComparison() {
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
          Model Comparison \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how model comparison works, one stage at a time.
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
