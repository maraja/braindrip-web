import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCFeaturePyramidNetwork() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine an editor reviewing a satellite image. Looking at the full zoomed-out view, they can identify cities and highways (high-level semantics), but houses and cars are invisible. Zooming into a neighborhood reveals individual structures (spatial detail), but they lose the big-picture context.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A standard backbone (e.g., ResNet) naturally produces a feature pyramid through its stages. For ResNet, we use the output of each residual block group:  C_2: stride 4, 1/4 spatial resolution C_3: stride 8, 1/8 spatial resolution C_4: stride 16, 1/16 spatial resolution C_5: stride 32, 1/32 spatial resolution' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, a Feature Pyramid Network (Lin et al., 2017) augments a standard CNN backbone with a top-down pathway and lateral connections. The bottom-up pathway is the backbone\'s forward pass, producing feature maps at progressively lower resolutions.' },
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
