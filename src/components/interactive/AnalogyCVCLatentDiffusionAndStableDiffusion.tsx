import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCLatentDiffusionAndStableDiffusion() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Running diffusion directly on 512x512 images means the U-Net must process tensors of shape 512 x 512 x 3 at every denoising step -- enormously expensive. Latent diffusion, introduced by Rombach et al.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Stage 1: Perceptual Compression (Autoencoder)  A VQ-VAE or KL-regularized autoencoder is trained to encode images x  &#123;R&#125;^&#123;H x W x 3&#125; into latent representations z  &#123;R&#125;^&#123;h x w x c&#125; with a spatial downsampling factor f:  [equation]  Stable Diffusion uses f = 8, so a 512x512 image becomes a 64x64x4 latent.' },
    { emoji: '🔍', label: 'In Detail', text: 'Stable Diffusion is the most prominent implementation of latent diffusion, combining it with CLIP-based text conditioning to create an open-source text-to-image model that runs on consumer GPUs.' },
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
