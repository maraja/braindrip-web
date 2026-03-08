import { useState } from 'react';

const STEPS = [
    { title: '1. Estimating the Components', desc: 'Naive Bayes requires two things: Class priors P(y = c): estimated as the fraction of training examples in class c. Likelihoods P(x_j  y = c): estimated differently depending on the feature type, giving rise to different Naive Bayes variants.' },
    { title: '2. Gaussian Naive Bayes', desc: 'For continuous features, assume each P(x_j  y = c) is Gaussian:  [equation]  where _&#123;jc&#125; and _&#123;jc&#125;^2 are the mean and variance of feature j for class c, estimated from the training data. This variant works well when features are roughly bell-shaped but can fail on skewed or multimodal distributions.' },
    { title: '3. Multinomial Naive Bayes', desc: 'For count-valued features (e.g., word counts in a document), the multinomial model is appropriate. Given a document represented as word counts x = (x_1, , x_d):  [equation]  where _&#123;jc&#125; = P(word  j  class  c) is estimated as:  [equation]  This is the standard model for text classification tasks.' },
    { title: '4. Bernoulli Naive Bayes', desc: 'For binary features (word present/absent rather than counts):  [equation]  Unlike the multinomial model, Bernoulli NB explicitly penalizes the absence of features. For short documents, this distinction matters: a word not appearing in a spam email is itself evidence.' },
    { title: '5. Laplace Smoothing', desc: 'If a feature value never appears with a particular class in the training data, P(x_j  y = c) = 0, which zeroes out the entire product. Laplace smoothing (additive smoothing) fixes this:  [equation]  where  &gt; 0 is the smoothing parameter (typically  = 1) and V is the vocabulary size.' },
    { title: '6. Working in Log-Space', desc: 'In practice, multiplying many small probabilities causes numerical underflow. The standard implementation works in log-space:  [equation]  This turns products into sums, which is both numerically stable and computationally efficient.' },
];

export default function WalkthroughMLFNaiveBayes() {
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
          Naive Bayes \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how naive bayes works, one stage at a time.
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
