import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCDensenet() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a team brainstorming session where every participant can hear and build upon what every previous participant said, not just the person who spoke right before them. In ResNet, each layer receives input only from the immediately preceding layer (plus a skip connection).' },
    { emoji: '⚙️', label: 'How It Works', text: 'In a dense block with L layers, layer l receives the concatenation of all preceding feature maps:  [equation]  where [] denotes channel-wise concatenation and H_l is a composite function (BN-ReLU-Conv). Crucially, features are concatenated, not summed as in ResNet. This preserves all previous information without any lossy combination.' },
    { emoji: '🔍', label: 'In Detail', text: 'DenseNet (Densely Connected Convolutional Networks) was introduced by Gao Huang, Zhuang Liu, Laurens van der Maaten, and Kilian Weinberger in 2017. DenseNet-121 achieves comparable accuracy to ResNet-101 on ImageNet while using roughly half the parameters and less computation.' },
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
