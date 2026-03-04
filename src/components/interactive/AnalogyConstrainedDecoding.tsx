import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyConstrainedDecoding() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🛤️', label: 'Train Tracks', text: 'Normally the model is a car that can drive anywhere. Constrained decoding puts it on train tracks — at each step, only tokens that keep the output valid according to a grammar or schema are allowed. Want valid JSON? The model can only pick "{" at the start, and after a key it must pick ":" — the tracks enforce the structure while the model chooses the content.' },
    { emoji: '📝', label: 'Fill-in-the-Blanks', text: 'Think of a Mad Libs game where you must fill in blanks with specific parts of speech. Constrained decoding gives the model a template: "output must be valid JSON matching this schema." At each token, a finite-state machine masks out illegal continuations, so the model literally cannot produce malformed output. It\'s free to be creative within the rules.' },
    { emoji: '🏗️', label: 'Building Codes', text: 'An architect can design creative buildings, but building codes constrain what\'s structurally sound. Constrained decoding applies "building codes" to generation — a formal grammar that masks illegal tokens at each step. The model retains creative freedom for content, but the structure is guaranteed valid. Libraries like Outlines and Guidance implement this efficiently using precompiled token masks.' },
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
