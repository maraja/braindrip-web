import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCInception() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are examining a painting and you want to appreciate it at multiple levels simultaneously -- the fine brushstrokes, the medium-scale shapes, and the overall composition.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The basic idea applies multiple filter sizes in parallel:  The problem: if the input has 256 channels and each branch outputs 256 channels, concatenation yields 4 x 256 = 1024 channels. The 5 x 5 convolution alone on 256 input channels producing 256 output channels requires 5^2 x 256 x 256  1.6M parameters and massive computation.' },
    { emoji: '🔍', label: 'In Detail', text: 'GoogLeNet, the first Inception network, won the ILSVRC-2014 classification challenge with 6.7% top-5 error -- beating VGGNet (7.3%) while using 20x fewer parameters (6.8M vs. 138M). The name "Inception" was inspired by the movie, and also references the "Network in Network" paper\'s idea of going deeper inside each layer.' },
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
