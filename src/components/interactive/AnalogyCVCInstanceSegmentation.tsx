import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCInstanceSegmentation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Suppose you are photographing a crowded parking lot. Semantic segmentation tells you which pixels are "car" -- but every car pixel gets the same label, so you cannot tell where one car ends and the next begins. Object detection draws a bounding box around each car, but bounding boxes include background and overlap with neighboring vehicles.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Top-down (detect-then-segment): Run an object detector (e.g., Faster R-CNN) to produce bounding-box proposals. For each proposal, predict a binary mask within the box region. The detector handles instance separation; the mask head handles pixel-level detail.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, the task requires predicting a set \\&#123;(m_k, c_k, s_k)\\&#125;_&#123;k=1&#125;^&#123;K&#125; where m_k  \\&#123;0,1\\&#125;^&#123;H x W&#125; is a binary mask for instance k, c_k is its class label, and s_k is a confidence score. Unlike semantic segmentation, the number of outputs K varies per image. Unlike detection, the output is a pixel mask rather than a bounding box.' },
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
