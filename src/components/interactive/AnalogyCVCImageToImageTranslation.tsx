import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCImageToImageTranslation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine an artist who can take your rough pencil sketch and render it as a photorealistic painting, or take a daytime photograph and reimagine it at sunset. Image-to-image translation automates this: given an image in one visual domain, produce a corresponding image in another domain while preserving the underlying structure.' },
    { emoji: '⚙️', label: 'How It Works', text: '(2017) proposed a general-purpose framework for paired image-to-image translation using a conditional GAN:  [equation]  combined with an L1 reconstruction loss:  [equation]  The total objective is &#123;L&#125; = &#123;L&#125;_&#123;cGAN&#125; +  &#123;L&#125;_&#123;L1&#125; with  = 100.' },
    { emoji: '🔍', label: 'In Detail', text: 'The key challenge is that this is fundamentally underdetermined -- many valid outputs exist for a given input. The field splits into two settings based on data availability: paired translation, where matching input-output examples exist, and unpaired translation, where only two unaligned collections of images are available.' },
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
