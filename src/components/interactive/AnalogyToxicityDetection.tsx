import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyToxicityDetection() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🛂', label: 'Content Customs', text: 'Like customs officers screening luggage at an airport, toxicity detection scans model inputs and outputs for harmful content — hate speech, harassment, threats, explicit material. A classifier model examines text and flags toxic content before it reaches the user. Some systems block it outright; others add warnings or trigger human review.' },
    { emoji: '🧪', label: 'Water Quality Test', text: 'Cities test tap water for contaminants before it reaches homes. Toxicity detection tests AI outputs for "contaminants" — harmful, offensive, or dangerous content — before they reach users. Different "contaminants" need different tests: profanity filters catch crude language, while more sophisticated classifiers detect subtle harassment, coded hate speech, or dangerous instructions.' },
    { emoji: '🚦', label: 'Traffic Signal', text: 'A traffic light controls flow for safety. Toxicity detectors act as traffic lights for content: green (safe to pass), yellow (borderline, maybe add a warning), red (block this output). The challenge is calibrating the light — too sensitive and you block legitimate medical or educational content; too permissive and harmful content slips through. Context-aware detection helps navigate this balance.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
