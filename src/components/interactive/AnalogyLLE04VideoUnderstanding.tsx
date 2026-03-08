import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE04VideoUnderstanding() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Video is the richest everyday data modality — it combines visual information, temporal dynamics, audio, and often text (subtitles, captions, on-screen text) into a single stream.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest approach to video understanding is to sample keyframes at regular intervals and process them as a set of independent images. A 60-second video sampled at 1 frame per second yields 60 images; a vision-language model processes each frame with a visual encoder and feeds the resulting tokens into the LLM.' },
    { emoji: '🔍', label: 'In Detail', text: 'For LLMs, video understanding represents the hardest multimodal challenge: it demands the visual perception of image models, the sequential reasoning of language models, and a temporal awareness that neither modality requires on its own.' },
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
