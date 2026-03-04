import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogySSM() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📻', label: 'Signal Filter', text: 'A radio filter processes an incoming signal through a continuous system that compresses it into a fixed-size state, then reconstructs the output. State space models (like Mamba) process sequences similarly: they maintain a compressed hidden state that gets updated with each new token, rather than attending to all previous tokens like transformers. This gives them linear scaling with sequence length instead of quadratic.' },
    { emoji: '🚂', label: 'Train with Fixed Memory', text: 'A transformer is like a student who re-reads all their notes before answering each question (attention over all tokens). An SSM is like a student who maintains a mental summary that gets updated with each new piece of information — they never go back to re-read, but their running summary captures the key points. This is faster for long sequences but risks losing details that a full re-read would catch.' },
    { emoji: '🎛️', label: 'Selective Compressor', text: 'Mamba\'s key innovation is selective state spaces: instead of compressing all information equally, it learns to selectively focus on relevant parts of the input — like a noise-canceling microphone that amplifies speech and suppresses background noise. This selectivity makes SSMs competitive with transformers on language tasks while maintaining the efficiency of linear-time processing, especially for very long sequences.' },
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
