import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCTwoStreamNetworks() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine watching a soccer game with one eye seeing only still photographs and the other eye seeing only motion trails. The photograph eye recognizes the ball, the players, and the field. The motion-trail eye detects who is running, the direction of a kick, and the speed of the ball. Your brain fuses both signals to understand the full action.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The spatial stream is a standard image classification CNN (originally VGG-M or VGG-16, later ResNets) applied to a single RGB frame sampled from the video clip. It captures appearance information: objects, scenes, textures, and poses. The input is a single frame of shape H x W x 3.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally introduced by Simonyan and Zisserman (2014), two-stream networks decompose video understanding into appearance recognition and motion recognition, each handled by a separate deep convolutional network.' },
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
