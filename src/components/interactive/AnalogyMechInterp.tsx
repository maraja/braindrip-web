import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMechInterp() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🔬', label: 'Neuroscience for AI', text: 'Neuroscientists study individual neurons and circuits to understand how the brain works. Mechanistic interpretability does the same for neural networks — studying individual neurons, attention heads, and circuits to understand how the model actually computes its outputs. The goal is to reverse-engineer the algorithms the model has learned, moving from "it works" to "we know why it works."' },
    { emoji: '🔧', label: 'Engine Teardown', text: 'A mechanic disassembles an engine to understand exactly how each part contributes to the whole. Mechanistic interpretability disassembles neural networks: identifying features (what neurons detect), circuits (how neurons connect to implement algorithms), and superposition (how features are packed into limited dimensions). Tools like sparse autoencoders help decompose the model into interpretable components.' },
    { emoji: '🗺️', label: 'Brain Mapping', text: 'Like mapping which brain regions control speech, vision, and movement, mechanistic interpretability maps which model components handle specific functions. Researchers have found "induction heads" that do in-context learning, circuits that do modular arithmetic, and features representing specific concepts. This understanding could eventually let us diagnose failure modes, remove unwanted behaviors, and verify safety properties.' },
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
