import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCActionRecognition() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a sports commentator who, given a short video clip, must identify the activity being performed: "swimming," "pole vault," or "dribbling a basketball." They rely on visual cues (the pool, the pole, the court), body movements (arm strokes, vaulting motion, hand-ball interaction), and temporal context (how the motion unfolds over time).' },
    { emoji: '⚙️', label: 'How It Works', text: 'The field is defined by its datasets, which have grown dramatically in scale:  UCF-101 and HMDB-51 are small and largely saturated (&gt;98% and &gt;85% accuracy). Kinetics-400 remains the primary benchmark.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, action recognition is a video classification problem. Given a video clip V represented as a tensor T x H x W x C, the goal is to learn a function f(V)  &#123;y&#125; where &#123;y&#125;  \\&#123;1, , K\\&#125; is the predicted action class.' },
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
