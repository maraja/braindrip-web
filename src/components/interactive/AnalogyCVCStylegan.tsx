import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCStylegan() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine painting a portrait where you separately control the face shape, skin texture, hair style, and lighting with independent dials. Traditional generators entangle all these factors in a single noise vector, making fine control impossible. StyleGAN (Karras et al.' },
    { emoji: '⚙️', label: 'How It Works', text: 'StyleGAN replaces the traditional generator input with a constant learned tensor 4 x 4 x 512 and introduces three new components:  Mapping Network f: An 8-layer MLP that maps the input noise z  &#123;R&#125;^&#123;512&#125; to an intermediate latent space w  &#123;W&#125;  &#123;R&#125;^&#123;512&#125;. This nonlinear mapping disentangles factors of variation.' },
    { emoji: '🔍', label: 'In Detail', text: 'The result was the first GAN to produce photorealistic 1024x1024 face images with smooth, interpretable latent space navigation, setting a new standard for controllable image synthesis.' },
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
