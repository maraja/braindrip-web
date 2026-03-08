import { useState } from 'react';

const STEPS = [
    { title: '1. Intersection over Union (IoU)', desc: 'IoU measures the spatial overlap between a predicted box B_p and a ground-truth box B_&#123;gt&#125;:  [equation]  IoU ranges from 0 (no overlap) to 1 (perfect overlap). A detection is considered a True Positive if IoU   for some threshold .' },
    { title: '2. Matching Predictions to Ground Truth', desc: 'Sort all detections by confidence score (descending). For each detection, find the ground-truth box with highest IoU.' },
    { title: '3. Precision-Recall Curve', desc: 'Walking through detections from highest to lowest confidence:  After each detection, update cumulative TP and FP counts. Precision_k = &#123;TP_k&#125;&#123;TP_k + FP_k&#125; Recall_k = &#123;TP_k&#125;&#123;Total Ground Truth&#125;  This generates a zigzag precision-recall curve that generally trends downward (precision drops as recall.' },
    { title: '4. Average Precision (AP)', desc: 'AP is the area under the precision-recall curve. Two interpolation methods exist:  11-Point Interpolation (Pascal VOC 2007): Sample precision at 11 recall values \\&#123;0, 0.1, 0.2, ..., 1.0\\&#125;:  [equation]  where p_&#123;interp&#125;(r) = _&#123;r\'  r&#125; p(r\') is the maximum precision at recall  r.' },
    { title: '5. COCO Evaluation Protocol', desc: 'COCO defines the comprehensive evaluation standard used by most modern detection papers:  Primary metric -- AP (or mAP): Averaged over 10 IoU thresholds from 0.50 to 0.95 in steps of 0.' },
    { title: '6. Worked Example', desc: 'Consider 3 ground-truth boxes (GT1, GT2, GT3) and 5 detections sorted by confidence:  *D4 matches GT1, but GT1 was already matched by D1, so D4 is FP. At IoU threshold 0.50, AP is computed from the interpolated PR curve.' },
];

export default function WalkthroughCVCDetectionMetrics() {
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
          Detection Metrics \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how detection metrics works, one stage at a time.
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
