import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCHybridCnnTransformer() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine an assembly line where specialized workers handle the early stages and generalists handle the later stages. In the beginning, precise, repetitive local operations are needed (cutting, sanding), and specialists with fixed tools excel. Later, complex decisions require flexible reasoning about the whole product.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A typical hybrid architecture follows this structure:  CNN stem or early stages: Convolutional layers process the raw image, producing feature maps at reduced spatial resolution (e.g., stride 16). Tokenization: The CNN feature map is flattened or projected into a sequence of tokens.' },
    { emoji: '🔍', label: 'In Detail', text: 'The core insight is that CNNs and Transformers have complementary strengths. CNNs provide translation equivariance, locality, and strong performance with limited data. Transformers provide dynamic, input-dependent attention and a global receptive field.' },
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
