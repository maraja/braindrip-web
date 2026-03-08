import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCDepthEstimation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine holding up a photograph and trying to judge how far away each object is -- your brain does this effortlessly using cues like relative size, occlusion, texture gradients, and perspective. Depth estimation teaches machines to do the same: given one or more images, predict a dense map where each pixel stores its distance from the camera.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Stereo methods exploit the horizontal disparity between left and right images captured from cameras with a known baseline b. Depth Z relates to disparity d and focal length f by:  [equation]  Classical approaches (SGM, Semi-Global Matching) compute matching costs over a disparity range.' },
    { emoji: '🔍', label: 'Monocular Depth Estimation', text: 'Monocular methods predict depth from a single RGB image using an encoder-decoder architecture. The encoder (often a pretrained backbone like DPT with a Vision Transformer) extracts multi-scale features, and the decoder upsamples to produce a dense depth map. Key supervised models: MiDaS (Ranftl et al.' },
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
