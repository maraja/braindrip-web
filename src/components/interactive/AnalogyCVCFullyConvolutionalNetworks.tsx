import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCFullyConvolutionalNetworks() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a standard image classifier as a funnel: an image goes in, features get compressed through convolutional layers, and then fully connected layers crush everything into a single vector of class scores. The spatial layout -- where things are -- is deliberately discarded.' },
    { emoji: '⚙️', label: 'How It Works', text: '(2015) showed that any classification CNN can be "convolutionalized":  Take a trained classifier (e.g., VGG-16 with three 4096-d FC layers). Reinterpret each FC layer as a 1x1 convolution. A fully connected layer with 4096 outputs applied to a 7 x 7 x 512 feature map is equivalent to a 7 x 7 convolution with 4096 output channels.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, an FCN is any network composed entirely of convolutional, pooling, and upsampling layers -- no fully connected (dense) layers. Given an input I  &#123;R&#125;^&#123;H x W x 3&#125;, the network produces O  &#123;R&#125;^&#123;H x W x C&#125;, where C is the number of classes.' },
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
