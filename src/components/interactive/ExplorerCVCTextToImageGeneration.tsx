import { useState } from 'react';

const DETAILS = [
    { label: 'Latent space', detail: 'Stable Diffusion\'s VAE compresses 512x512x3 images to 64x64x4 latents; SDXL uses 128x128x4 for 1024px images' },
    { label: 'Inference cost', detail: '~4 seconds for 50-step DDPM on an A100 (Stable Diffusion 1.5); ~2 seconds with DDIM 20-step; ~8 seconds for SDXL' },
    { label: 'Training data', detail: 'Stable Diffusion v1.5 trained on ~2B image-text pairs from LAION-5B; DALL-E 3 on proprietary data with synthetic captions' },
    { label: 'FID scores', detail: 'Stable Diffusion achieves ~8-12 FID on COCO-30K (lower is better); human preference now dominates as the primary metric' },
    { label: 'Guidance scale trade-off', detail: 'Higher guidance (w &gt; 10) improves text alignment but causes saturation artifacts and reduced diversity; w = 7-8 is typical' },
    { label: 'Negative prompts', detail: 'Specifying what to avoid ("blurry, low quality, deformed") substantially improves output quality in practice' },
];

export default function ExplorerCVCTextToImageGeneration() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Text-to-Image Generation \u2014 Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {DETAILS.map((d, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} style={{
            textAlign: 'left' as const, background: open === i ? '#F0EBE1' : '#FDFBF7', border: '1px solid #E5DFD3',
            borderRadius: '10px', padding: '0.875rem 1rem', cursor: 'pointer', width: '100%', transition: 'background 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.95rem', fontWeight: 600, color: '#2C3E2D' }}>
                {d.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#7A8B7C', transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                &#9654;
              </span>
            </div>
            {open === i && (
              <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: '0.5rem 0 0 0' }}>
                {d.detail}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
