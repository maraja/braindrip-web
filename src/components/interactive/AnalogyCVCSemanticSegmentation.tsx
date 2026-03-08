import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCSemanticSegmentation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine coloring every square centimeter of a satellite photo with a different crayon: green for forest, blue for water, gray for road, brown for building. You are not drawing boxes around regions -- you are labeling every single point.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Each pixel (i, j) is treated as an independent classification problem, though spatial context from the surrounding region heavily influences the prediction. The network typically outputs a tensor of shape H x W x C, where each spatial location holds a probability distribution over classes. The predicted label is:  [equation]' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given an image I  &#123;R&#125;^&#123;H x W x 3&#125;, the goal is to learn a mapping f: &#123;R&#125;^&#123;H x W x 3&#125;  \\&#123;1, , C\\&#125;^&#123;H x W&#125;, where C is the number of semantic classes. Unlike object detection, which outputs bounding boxes, or image classification, which outputs a single label, semantic segmentation produces a dense prediction -- one decision per pixel.' },
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
