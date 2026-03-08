import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCFaceDetectionAndRecognition() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of face detection as a bouncer scanning a crowd to find every face, and face recognition as the bouncer checking each face against a guest list. Detection answers "where are the faces?" while recognition answers "whose face is this?"' },
    { emoji: '⚙️', label: 'How It Works', text: 'Viola-Jones (2001): Cascaded classifiers using Haar-like features and AdaBoost. Achieved real-time detection at ~15 FPS on 2001 hardware. Limited to frontal, upright faces.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, face detection is a special case of object detection that localizes face bounding boxes (and often facial landmarks). Face recognition extracts a compact embedding vector from a detected face and compares it against a gallery of known identities. The two fundamental tasks are:' },
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
