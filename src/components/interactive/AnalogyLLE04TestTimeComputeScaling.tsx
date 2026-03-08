import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE04TestTimeComputeScaling() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'For years, the AI community operated under a single scaling mantra: make models bigger, train on more data, use more GPUs during training. This was "train harder." Test-time compute scaling introduced the complementary idea: "think harder.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Research has identified two primary strategies for using additional compute at inference time. The first is sequential refinement: the model generates a long chain-of-thought, reasoning step by step, catching and correcting errors along the way. This is what o1 and R1 do.' },
    { emoji: '🔍', label: 'In Detail', text: 'The analogy is straightforward. Imagine two students taking an exam. Student A spent ten years in school but rushes through each question in 30 seconds. Student B spent five years in school but takes five minutes to carefully work through each problem, checking their work and trying alternative approaches.' },
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
