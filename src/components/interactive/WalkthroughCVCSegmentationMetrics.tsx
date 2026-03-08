import { useState } from 'react';

const STEPS = [
    { title: '1. Pixel Accuracy', desc: 'The simplest metric: fraction of correctly classified pixels. [equation]  where n_&#123;ii&#125; is the number of pixels of class i correctly predicted, and t_i is the total number of pixels of class i.' },
    { title: '2. Mean Intersection over Union (mIoU)', desc: 'The standard metric for semantic segmentation. For each class c, compute the IoU between predicted and ground-truth pixel sets:  [equation]  Then average across all C classes:  [equation]  mIoU treats all classes equally (macro average), so rare classes have equal influence.' },
    { title: '3. Dice Coefficient / F1 Score', desc: 'The Dice coefficient is equivalent to the F1 score computed at the pixel level:  [equation]  The relationship to IoU: Dice = &#123;2  IoU&#125;&#123;1 + IoU&#125;. Dice is always  IoU for the same prediction.' },
    { title: '4. Boundary Metrics', desc: 'Standard mIoU and Dice can be insensitive to boundary quality -- a prediction that is 2 pixels off everywhere gets nearly the same score as a perfect one. Boundary IoU (Cheng et al., 2021): Computes IoU only within a narrow band (d pixels) around the ground-truth boundary.' },
    { title: '5. Instance Segmentation Metrics', desc: 'Instance segmentation uses mask AP -- the same COCO AP protocol as detection, but IoU is computed between predicted and ground-truth masks instead of bounding boxes. [equation]  COCO mask AP is evaluated at IoU thresholds 0.50 to 0.95 (same as box AP).' },
    { title: '6. Panoptic Quality (PQ)', desc: 'Panoptic segmentation unifies semantic and instance segmentation. PQ (Kirillov et al., 2019) evaluates both recognition and segmentation quality:  [equation]  SQ: Average IoU of matched segments.' },
];

export default function WalkthroughCVCSegmentationMetrics() {
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
          Segmentation Metrics \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how segmentation metrics works, one stage at a time.
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
