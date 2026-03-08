import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCNeuralStyleTransfer() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine taking a photograph of a city skyline and rendering it as if Van Gogh had painted it -- with his swirling brushstrokes and vivid color palette -- while keeping the buildings, sky, and composition intact. Neural style transfer does exactly this by leveraging the hierarchical feature representations learned by deep CNNs.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given a content image p, a style image a, and a generated image x (initialized as noise or the content image), the method minimizes:  [equation]  using gradient descent directly on the pixel values of x (not on network weights).' },
    { emoji: '🔍', label: 'In Detail', text: 'Gatys et al. (2015) discovered that optimizing an image to simultaneously match the content features of a photograph and the style features of a painting produces striking artistic renderings.' },
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
