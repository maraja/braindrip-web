import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCTextToImageGeneration() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Picture a painter who takes verbal commissions: you describe "a cat wearing a top hat, sitting on a crescent moon, oil painting style," and the painter creates exactly that image. Text-to-image generation automates this creative process.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Text-to-image diffusion models learn to reverse a noising process. During training:  Take a clean image x_0 Add Gaussian noise over T steps: x_t = &#123;&#123;&#125;_t&#125;\\,x_0 + &#123;1 - &#123;&#125;_t&#125;\\,&#123;&#125; Train a neural network _(x_t, t, c) to predict the noise &#123;&#125; given the noisy image, timestep t, and text conditioning c  At inference, start from pure noise x_T  &#123;N&#125;(0, I).' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, the task is conditional image generation: given a text string c, generate an image x such that x  p(x | c). Modern approaches use diffusion models that learn to iteratively denoise random Gaussian noise into a coherent image, conditioned on text embeddings from a language model.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u2726 KEY PERSPECTIVES</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' as const }}>
        {perspectives.map((p, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA88818' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{perspectives[idx].text}</p>
    </div>
  );
}
