import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const labelStyle = {
  fontSize: '10px',
  fontWeight: 700 as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: '#6E8B6B',
};

const rounds = [
  {
    label: 'Initial Response',
    response: 'Machine learning is a type of AI where computers learn from data. There are different types like supervised learning and unsupervised learning. It is used in many applications.',
    critique: null,
    scores: { accuracy: 5, depth: 2, clarity: 3, specificity: 2 },
    overall: 30,
  },
  {
    label: 'Self-Critique',
    response: null,
    critique: 'Issues with my response:\n1. Too vague — "learn from data" needs more explanation of how\n2. Missing key type: reinforcement learning\n3. No concrete examples of applications\n4. No mention of training/inference distinction\n5. Lacks any technical depth for the audience',
    scores: null,
    overall: null,
  },
  {
    label: 'Improved Response',
    response: 'Machine learning is a subset of AI where models learn patterns from data by optimizing a loss function through iterative training. Three main paradigms exist:\n\n- Supervised learning: Models learn from labeled examples (e.g., classifying emails as spam)\n- Unsupervised learning: Models find structure in unlabeled data (e.g., customer segmentation via clustering)\n- Reinforcement learning: Agents learn through trial and error with reward signals (e.g., game-playing AI)\n\nDuring training, the model adjusts parameters to minimize prediction errors. At inference time, the trained model makes predictions on new, unseen data.',
    critique: null,
    scores: { accuracy: 8, depth: 7, clarity: 8, specificity: 7 },
    overall: 75,
  },
  {
    label: 'Second Critique',
    response: null,
    critique: 'Improvement noted, but remaining issues:\n1. Could mention specific algorithms (linear regression, neural networks)\n2. Should address the bias-variance tradeoff\n3. Missing discussion of data requirements and preprocessing\n4. Could add a note about evaluation metrics',
    scores: null,
    overall: null,
  },
  {
    label: 'Final Response',
    response: 'Machine learning is a subset of AI where models learn patterns from data by iteratively optimizing a loss function — adjusting millions of parameters to minimize prediction errors.\n\nThree core paradigms:\n- **Supervised learning**: Train on labeled data (classification, regression). Algorithms: logistic regression, random forests, neural networks. Example: email spam detection.\n- **Unsupervised learning**: Discover structure in unlabeled data. Algorithms: k-means clustering, PCA. Example: customer segmentation.\n- **Reinforcement learning**: Learn via reward signals through trial and error. Example: AlphaGo, robotics control.\n\nKey considerations:\n- **Data quality**: Models are only as good as their training data. Preprocessing (normalization, handling missing values) is critical.\n- **Bias-variance tradeoff**: Simple models underfit (high bias); complex models overfit (high variance). Regularization and cross-validation help find the balance.\n- **Evaluation**: Accuracy, precision, recall, F1-score, and AUC-ROC measure model performance on held-out test sets.',
    critique: null,
    scores: { accuracy: 9, depth: 9, clarity: 9, specificity: 9 },
    overall: 90,
  },
];

const dimensions = ['accuracy', 'depth', 'clarity', 'specificity'];

export default function SelfCritiqueDemo() {
  const [step, setStep] = useState(0);
  const current = rounds[step];

  const scoredRounds = rounds.filter(r => r.scores !== null);
  const currentScored = scoredRounds.filter((_, i) => {
    const roundStep = rounds.indexOf(scoredRounds[i]);
    return roundStep <= step;
  });

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={labelStyle}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Self-Critique Demo
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Watch a model generate, critique, and improve its own response. Quality scores improve across iterations.
        </p>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#2C3E2D' }}>
        <strong>Prompt:</strong> "Explain machine learning to a technical audience."
      </div>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
        {rounds.map((r, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', cursor: 'pointer', flex: 1,
            border: `1px solid ${step === i ? (r.critique ? '#C76B4A' : '#8BA888') + '66' : '#E5DFD3'}`,
            background: step === i ? (r.critique ? '#C76B4A' : '#8BA888') + '10' : i < step ? '#F5F0E8' : 'transparent',
            color: step === i ? (r.critique ? '#C76B4A' : '#8BA888') : i <= step ? '#5A6B5C' : '#B0A898',
            fontWeight: step === i ? 600 : 400,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>{r.label}</button>
        ))}
      </div>

      <div style={{
        background: current.critique ? 'rgba(199, 107, 74, 0.05)' : 'rgba(139, 168, 136, 0.05)',
        border: `1px solid ${current.critique ? '#C76B4A33' : '#8BA88833'}`,
        borderRadius: '10px', padding: '1rem', marginBottom: '1rem',
      }}>
        <div style={{
          fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
          color: current.critique ? '#C76B4A' : '#8BA888', marginBottom: '0.5rem',
        }}>
          {current.critique ? 'Self-Critique' : 'Model Response'}
        </div>
        <div style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {current.response || current.critique}
        </div>
      </div>

      {current.scores && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ ...labelStyle, marginBottom: '0.4rem' }}>Quality Scores</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
            {dimensions.map(dim => {
              const score = (current.scores as Record<string, number>)[dim];
              const color = score >= 8 ? '#8BA888' : score >= 5 ? '#D4A843' : '#C76B4A';
              return (
                <div key={dim} style={{ padding: '0.5rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color }}>{score}/10</div>
                  <div style={{ fontSize: '0.7rem', color: '#7A8B7C', textTransform: 'capitalize' }}>{dim}</div>
                </div>
              );
            })}
          </div>
          {current.overall !== null && (
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#5A6B5C' }}>Overall:</span>
              <div style={{ flex: 1, height: '8px', background: '#E5DFD3', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${current.overall}%`, background: current.overall >= 80 ? '#8BA888' : current.overall >= 50 ? '#D4A843' : '#C76B4A', borderRadius: '4px', transition: 'width 0.5s ease' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D' }}>{current.overall}%</span>
            </div>
          )}
        </div>
      )}

      {currentScored.length > 1 && (
        <div style={{ padding: '0.6rem 0.8rem', background: '#F0EBE1', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.78rem', color: '#5A6B5C' }}>
          Quality improvement: {currentScored[0].overall}% → {currentScored[currentScored.length - 1].overall}% ({'+' + ((currentScored[currentScored.length - 1].overall ?? 0) - (currentScored[0].overall ?? 0))} points through self-critique)
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
          padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem', cursor: step === 0 ? 'not-allowed' : 'pointer',
          border: '1px solid #E5DFD3', background: 'transparent', color: step === 0 ? '#B0A898' : '#5A6B5C',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>Back</button>
        <button onClick={() => setStep(Math.min(rounds.length - 1, step + 1))} disabled={step === rounds.length - 1} style={{
          padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem', cursor: step === rounds.length - 1 ? 'not-allowed' : 'pointer',
          border: '1px solid #C76B4A', background: step === rounds.length - 1 ? '#E5DFD3' : 'rgba(199, 107, 74, 0.08)',
          color: step === rounds.length - 1 ? '#B0A898' : '#C76B4A', fontWeight: 600,
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>Next</button>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#7A8B7C' }}>
          {step + 1} / {rounds.length}
        </span>
      </div>
    </div>
  );
}
