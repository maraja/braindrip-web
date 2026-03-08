import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCBenchmarkLeaderboards() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a scoreboard in a sports league: every team plays the same game under the same rules, and rankings are clear. Benchmark leaderboards serve the same function for computer vision -- they provide standardized evaluation on fixed datasets with agreed-upon metrics, enabling apples-to-apples comparison of methods.' },
    { emoji: '⚙️', label: 'How It Works', text: 'ImageNet (ILSVRC): Metric: Top-1 and top-5 accuracy on 50K validation images. History: AlexNet (2012, 63.3% top-1) to CoCa (2022, 91.0% top-1). A 28-point improvement in 10 years.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, a benchmark leaderboard is a public ranking of methods evaluated on a held-out test set using a standardized protocol. The ranking metric (top-1 accuracy, mAP, mIoU, FID) is predefined. Test set labels are typically hidden to prevent overfitting; submissions are evaluated by a server (e.g., COCO evaluation server, CodaLab).' },
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
