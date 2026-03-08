import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCLearningRateScheduling() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of hiking down a mountain in fog. At first, you take large steps to cover ground quickly while you are far from the valley floor. As the terrain flattens and you suspect you are near the bottom, you shorten your steps to avoid overshooting the lowest point.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest and historically most common schedule. Multiply the learning rate by a factor  at predetermined epochs:  [equation]  where s is the step interval and  is typically 0.1. The classic ImageNet recipe: _0 = 0.1, decay by 10x at epochs 30, 60, 90 (out of 90 total).' },
    { emoji: '🔍', label: 'In Detail', text: 'The learning rate  is the single most important hyperparameter in deep learning (Bengio, 2012). A fixed learning rate forces a compromise between early training speed and final precision. Scheduling removes this trade-off by adapting  over the course of training.' },
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
