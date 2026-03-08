import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCOcrAndDocumentUnderstanding() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine holding a foreign-language restaurant menu up to your phone camera and instantly seeing a translation overlaid on the image. Behind this is a multi-stage pipeline: first find where text appears (detection), then read each text region character by character (recognition), and finally understand the structure (this is a price, that is a dish.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Text detection locates text regions as bounding boxes or polygons in an image. EAST (Zhou et al., 2017): Efficient and Accurate Scene Text detector. A fully convolutional network that directly predicts rotated bounding boxes or quadrilaterals from a single feature map.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, OCR is the conversion of text in images (scene text, printed documents, handwriting) into machine-encoded strings. Document AI encompasses layout analysis, table extraction, key-value pair identification, and document classification, treating the page as a structured object rather than a flat image.' },
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
