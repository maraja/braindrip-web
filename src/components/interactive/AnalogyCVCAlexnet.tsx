import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCAlexnet() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a community of craftspeople who had been building furniture by hand for decades, each master specializing in one technique -- carving, joinery, finishing. Then someone brings in a general-purpose CNC machine that, with enough examples and electricity, learns to do all those tasks and produces better furniture than any single specialist.' },
    { emoji: '⚙️', label: 'How It Works', text: 'AlexNet processes 224 x 224 x 3 RGB images through 5 convolutional layers and 3 fully connected layers:  Total parameters: approximately 60 million, making it the largest CNN trained at scale at the time.' },
    { emoji: '🔍', label: 'In Detail', text: 'AlexNet was designed by Alex Krizhevsky, Ilya Sutskever, and Geoffrey Hinton at the University of Toronto. It achieved a top-5 error rate of 16.4% on the ImageNet LSVRC-2012 challenge, compared to 26.' },
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
