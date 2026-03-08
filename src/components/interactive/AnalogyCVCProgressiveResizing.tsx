import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCProgressiveResizing() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine learning to paint. An instructor would not hand you a 4K canvas on day one -- you would start with small sketches to learn composition and shape, then progressively move to larger canvases where you refine details. Progressive resizing applies this curriculum to CNN training: begin with low-resolution images (e.g.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A typical progressive resizing schedule for ImageNet:  Since computational cost scales roughly as O(resolution^2), a 128x128 image requires ~3.1x fewer FLOPs per sample than 224x224. Combined with the ability to fit larger batch sizes in GPU memory, the throughput advantage of early phases is substantial.' },
    { emoji: '🔍', label: 'In Detail', text: 'This technique was popularized by the fast.ai library (Howard & Gugger, 2020) and became a key component of several competition-winning solutions.' },
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
