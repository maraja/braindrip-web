import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPAutomaticSpeechRecognition() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine transcribing a conversation in a noisy coffee shop. Your brain performs an extraordinary feat: it separates the speaker\'s voice from background clatter, segments the continuous sound stream into words (even though there are no pauses between most words in fluent speech), resolves ambiguities using context ("recognize speech" vs.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Traditional ASR decomposes the problem into four stages:  Feature Extraction: Raw audio (sampled at 16 kHz typically) is converted into compact acoustic features. The standard representation is Mel-frequency cepstral coefficients (MFCCs): the signal is windowed into 25 ms frames with 10 ms stride, a Fourier transform extracts the frequency.' },
    { emoji: '🔍', label: 'In Detail', text: 'ASR is the task of converting an audio waveform of human speech into a sequence of words. It sits at the intersection of signal processing, acoustics, and natural language processing.' },
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
