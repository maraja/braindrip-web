import { useState } from 'react';

const STEPS = [
    { title: '1. The Adapter Paradigm and Its Limits (2022-2023)', desc: 'The adapter approach — exemplified by LLaVA, Flamingo, and MiniGPT-4 — connects pre-trained vision encoders to pre-trained language models using small trainable modules: linear projections, cross-attention layers, or perceiver resamplers.' },
    { title: '2. Early Fusion vs. Late Fusion', desc: 'The technical distinction between native and adapter approaches comes down to where modalities are combined. Late fusion (the adapter approach) processes each modality independently through most of the network and combines them only near the output layers.' },
    { title: '3. Gemini: The First Major Native Multimodal Model (2023)', desc: 'Google\'s Gemini (December 2023) was the first frontier model designed as natively multimodal from the ground up. Trained on interleaved sequences of text, images, audio, and video, Gemini could process and reason about mixed-modality inputs in ways that adapter models could not.' },
    { title: '4. GPT-4o: The Omni Architecture (2024)', desc: 'GPT-4o ("omni," May 2024) represented a further evolution: a single model architecture that handles text, vision, and audio input and output in a unified forward pass. Previous systems like GPT-4V had separate processing paths for vision.' },
    { title: '5. Tokenization Across Modalities', desc: 'Native multimodal training requires converting all modalities into token sequences that can be interleaved and processed together. Images are converted to patch tokens using a Vision Transformer (ViT): a 224x224 image with 16x16 patches yields 196 tokens; a 336x336 image yields 576 tokens.' },
    { title: '6. Training Data for Multimodal Models', desc: 'Native multimodal training demands massive paired and interleaved datasets. Common sources include:  Image-text pairs: LAION-5B (5 billion pairs), WebLI (10 billion pairs) Video-text pairs: WebVid (10 million), HD-VILA (100 million) Audio-text pairs: speech transcriptions, podcast descriptions,.' },
];

export default function WalkthroughLLE02NativeMultimodalTraining() {
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
          Native Multimodal Training \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how native multimodal training works, one stage at a time.
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
