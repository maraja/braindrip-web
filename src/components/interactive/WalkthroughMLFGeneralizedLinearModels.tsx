import { useState } from 'react';

const STEPS = [
    { title: '1. The Three Components of a GLM', desc: 'Every GLM is specified by three components:  Random Component: The response y_i follows a distribution from the exponential family:  [equation]  where _i is the natural (canonical) parameter,  is a dispersion parameter, and b(), a(), c() are known functions defining the specific distribution.' },
    { title: '2. Exponential Family Distributions', desc: 'The exponential family includes many common distributions:  The canonical link function sets g() = , linking the linear predictor directly to the natural parameter. Using the canonical link simplifies estimation and yields desirable statistical properties, but non-canonical links can also be used.' },
    { title: '3. Logistic Regression as a GLM', desc: 'Binary classification via logistic regression is a GLM with: Random component: y_i  Bernoulli(_i) Link function: logit, g(_i) = &#123;_i&#125;&#123;1 - _i&#125; Model: &#123;P(y_i = 1  x_i)&#125; = x_i^T &#123;&#125;  The inverse link gives the predicted probability:  [equation]  Coefficients are interpreted on the log-odds scale: a unit.' },
    { title: '4. Poisson Regression as a GLM', desc: 'For count data (e.g., number of insurance claims): Random component: y_i  Poisson(_i) Link function: log, g(_i) =  _i Model:  &#123;E&#125;[y_i | x_i] = x_i^T &#123;&#125;  The inverse link ensures predictions are non-negative: &#123;&#125;_i = e^&#123;x_i^T &#123;&#125;&#125;.' },
    { title: '5. Estimation via IRLS', desc: 'GLMs are fit by maximum likelihood. The log-likelihood for the exponential family is:  [equation]  There is generally no closed-form solution (except for the normal distribution, which recovers OLS).' },
    { title: '6. Overdispersion', desc: 'The Poisson distribution assumes Var(y) =  (mean equals variance). In practice, count data often exhibits overdispersion: Var(y) &gt; .' },
];

export default function WalkthroughMLFGeneralizedLinearModels() {
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
          Generalized Linear Models \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how generalized linear models works, one stage at a time.
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
