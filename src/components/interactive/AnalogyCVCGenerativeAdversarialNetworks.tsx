import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCGenerativeAdversarialNetworks() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a counterfeiter (generator) trying to produce fake currency and a detective (discriminator) trying to spot fakes. As the detective gets better, the counterfeiter must improve too, and vice versa. Over time, the counterfeiter produces bills indistinguishable from real ones. Generative Adversarial Networks, introduced by Goodfellow et al.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The original GAN used fully connected layers, but modern GANs are almost universally convolutional. DCGAN (Radford et al., 2015) established the template:  Generator: Takes a noise vector z  &#123;R&#125;^&#123;128&#125;, projects it to a small spatial feature map, then upsamples via transposed convolutions with batch normalization and ReLU activations.' },
    { emoji: '🔍', label: 'In Detail', text: 'The generator G maps random noise z  p_z(z) to synthetic data G(z). The discriminator D outputs the probability that its input is real rather than generated. The objective is:' },
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
