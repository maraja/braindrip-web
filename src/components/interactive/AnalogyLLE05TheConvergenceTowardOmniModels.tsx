import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE05TheConvergenceTowardOmniModels() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'In 2020, the AI landscape was a collection of specialists: GPT-3 for text, ViT for images, Wav2Vec for audio, each excelling in its domain but blind to the others. By 2025, the field has converged toward omni-models — single systems that can see, hear, read, write, speak, generate images, reason about video, execute code, and use tools, all within.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The early deep learning era was defined by specialization. BERT (2018) and GPT-3 (2020) dominated text. Vision Transformers (Dosovitskiy et al., October 2020) and ResNets handled images.' },
    { emoji: '🔍', label: 'In Detail', text: 'This convergence is not just an engineering convenience. It reflects a deeper insight: intelligence is fundamentally cross-modal, and artificially separating modalities limits what AI systems can understand and do. The omni-model trajectory is reshaping how we build, deploy, and think about AI.' },
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
