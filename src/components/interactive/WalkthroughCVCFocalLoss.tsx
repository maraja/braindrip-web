import { useState } from 'react';

const STEPS = [
    { title: '1. Standard Cross-Entropy', desc: 'For a binary classification with probability p of the correct class:  [equation]  where p_t = p if the example is positive, and p_t = 1 - p otherwise. The problem: when a background anchor is classified correctly with p_t = 0.9, the loss is -(0.9)  0.105.' },
    { title: '2. Balanced Cross-Entropy', desc: 'A common first attempt: weight positive and negative examples by a factor _t:  [equation]  This addresses the imbalance in number of positives vs. negatives but does not distinguish between easy and hard examples.' },
    { title: '3. Focal Loss Definition', desc: '[equation]  The modulating factor (1 - p_t)^ has two key properties: When an example is misclassified (p_t is small), the factor approaches 1, and the loss is unaffected. When an example is well-classified (p_t  1), the factor approaches 0, down-weighting the loss.' },
    { title: '4. Effect of $\\gamma$ (Focusing Parameter)', desc: 'At  = 2 (the recommended value), an example with p_t = 0.9 has its loss reduced by a factor of 100 compared to CE. An example with p_t = 0.5 is only reduced by 4x.' },
    { title: '5. RetinaNet Architecture', desc: 'Focal loss was introduced alongside RetinaNet, a single-stage detector designed to demonstrate that class imbalance (not architecture) was the reason single-stage detectors lagged behind two-stage ones:  Backbone: ResNet + FPN producing feature maps at 5 scales (P_3 through P_7).' },
    { title: '6. Training Details', desc: '= 2,  = 0.25: Optimal values found by grid search on COCO val. Initialization bias: The classification subnet\'s final layer bias is initialized to b = -((1 - )/) where  = 0.01, ensuring the model starts by predicting low probability for all anchors.' },
];

export default function WalkthroughCVCFocalLoss() {
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
          Focal Loss \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how focal loss works, one stage at a time.
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
