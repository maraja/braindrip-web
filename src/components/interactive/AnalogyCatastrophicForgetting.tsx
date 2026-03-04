import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyCatastrophicForgetting() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📝', label: 'Overwritten Notes', text: 'Imagine a notebook where writing new notes erases the old ones underneath. Catastrophic forgetting occurs when fine-tuning a model on Task B overwrites the weights that were important for Task A. The model excels at the new task but "forgets" what it knew before. This is why aggressive fine-tuning on a narrow domain can degrade a model\'s general capabilities.' },
    { emoji: '🏠', label: 'Renovation Gone Wrong', text: 'Renovating a house for a new owner who wants everything different — knocking down walls, changing plumbing. The house now suits the new owner but is unrecognizable to the original one. Catastrophic forgetting is this over-renovation: when fine-tuning shifts too many weights too far, the model\'s original knowledge (pre-training) is destroyed to make room for the new task.' },
    { emoji: '🧠', label: 'Amnesia', text: 'A person who studies only French for years may find their Spanish deteriorating — but humans rarely lose it completely. Neural networks are worse: they can catastrophically lose previously learned information when trained on new data. Techniques like low learning rates, regularization, LoRA (freezing most weights), and replay buffers help prevent this — essentially protecting old memories while forming new ones.' },
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
