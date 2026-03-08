import { useState } from 'react';

const STEPS = [
    { title: '1. Encoder-Decoder: CNN + LSTM', desc: 'The foundational approach (Vinyals et al., 2015 -- "Show and Tell") treats captioning as a sequence-to-sequence problem:  Encoder: A pre-trained CNN (typically Inception, ResNet, or VGG) extracts a fixed-length visual feature vector from the image.' },
    { title: '2. Attention-Based Captioning: Show, Attend and Tell', desc: '(2015) introduced visual attention for captioning, allowing the decoder to focus on different image regions at each generation step:  The CNN encoder produces a spatial feature map (e.g., 14x14x512 from VGG or 7x7x2048 from ResNet) rather than a single vector.' },
    { title: '3. Bottom-Up and Top-Down Attention', desc: '(2018) replaced grid-based spatial attention with object-level ("bottom-up") attention. A Faster R-CNN detector (pre-trained on Visual Genome with 1,600 object classes and 400 attribute classes) proposes ~36 salient regions per image, each represented as a 2,048-dimensional feature vector plus.' },
    { title: '4. Transformer-Based Captioning', desc: 'Oscar (Li et al., 2020): Uses object tags (detected by Faster R-CNN) as anchor points to align image regions with text. The input to a BERT-like transformer is a triplet of (word tokens, object tags, region features).' },
    { title: '5. Evaluation Metrics', desc: 'Captioning evaluation is notoriously difficult because multiple valid descriptions exist for any image:  BLEU (Papineni et al., 2002): Modified n-gram precision against reference captions. BLEU-4 is standard for captioning but correlates poorly with human judgment in this setting.' },
    { title: '6. The Problem of Generic Captions', desc: 'A persistent issue: models learn to generate safe, generic captions that maximize metric scores against multiple references. "A man is standing in front of a building" is rarely wrong but also rarely informative.' },
];

export default function WalkthroughNLPImageCaptioning() {
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
          Image Captioning \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how image captioning works, one stage at a time.
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
