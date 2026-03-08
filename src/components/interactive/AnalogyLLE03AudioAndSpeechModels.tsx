import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE03AudioAndSpeechModels() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'For decades, speech AI lived in its own world — separate from text-based language models, using specialized architectures like CTC decoders, RNN transducers, and hidden Markov models. The audio revolution in LLMs is the story of speech and audio understanding being absorbed into the same Transformer-based systems that process text.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Whisper (Radford et al., September 2022) was the breakthrough that brought speech into the LLM paradigm. OpenAI trained an encoder-decoder Transformer on 680,000 hours of multilingual audio paired with transcriptions scraped from the internet.' },
    { emoji: '🔍', label: 'In Detail', text: 'What started as standalone speech recognition (converting audio to text) has evolved into models that understand audio natively — perceiving tone, emotion, music, ambient sounds, and multiple languages simultaneously — and can generate natural speech as output.' },
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
