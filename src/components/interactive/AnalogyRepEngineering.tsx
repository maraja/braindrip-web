import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyRepEngineering() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎛️', label: 'Mixing Console', text: 'A sound engineer adjusts sliders on a mixing board to change bass, treble, and reverb without re-recording the music. Representation engineering finds "sliders" in the model\'s activation space for concepts like honesty, helpfulness, or safety, then adjusts them. By adding or subtracting direction vectors in the model\'s hidden states, you can make it more truthful, less sycophantic, or less harmful — without retraining.' },
    { emoji: '🧬', label: 'Gene Editing', text: 'CRISPR edits specific genes without rewriting the whole genome. Representation engineering identifies specific directions in activation space that correspond to behaviors (truthfulness, refusal, emotion) and surgically modifies them. Find the "honesty direction," amplify it, and the model becomes more truthful. This is more targeted than RLHF (which adjusts the whole model) and more controllable than prompting (which is unreliable).' },
    { emoji: '🧭', label: 'Compass Adjustment', text: 'If your compass consistently points 10 degrees off north, you can add a correction factor. Representation engineering finds systematic biases in how the model represents concepts and adds correction vectors. By computing the difference between "honest" and "deceptive" activations across many examples, you extract a "honesty direction" that can steer the model at inference time — like calibrating the compass for the local magnetic field.' },
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
