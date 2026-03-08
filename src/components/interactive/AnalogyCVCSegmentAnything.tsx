import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCSegmentAnything() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a segmentation assistant that has seen so many objects that it can outline anything you point to -- a cell under a microscope, a building in a satellite photo, or a dog in a home video -- without ever having been specifically trained on cells, buildings, or dogs.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Image Encoder  A Vision Transformer (ViT-H by default) that processes the input image once to produce image embeddings: Input: 1024x1024 image (resized and padded). Architecture: ViT-H with 632M parameters, pre-trained with MAE (Masked Autoencoder). Output: 64x64 spatial embedding grid with 256 channels.' },
    { emoji: '🔍', label: 'In Detail', text: 'Released by Meta AI (Kirillov et al., 2023), SAM represents a paradigm shift: instead of training a separate model for each segmentation task, train one model on an enormous, diverse dataset and use prompts (points, boxes, masks, or text) to specify what to segment at inference time.' },
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
