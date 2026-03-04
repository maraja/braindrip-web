import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyWatermarking() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '💧', label: 'Invisible Ink', text: 'Paper currency has invisible watermarks that are undetectable in normal use but visible under UV light. LLM watermarking embeds a similar invisible signal in generated text by subtly biasing token choices. The text reads naturally to humans, but a detector with the secret key can statistically verify it was AI-generated. The pattern is imperceptible to readers but mathematically provable.' },
    { emoji: '🎵', label: 'Audio Fingerprinting', text: 'Music services embed inaudible fingerprints in songs to track unauthorized sharing. LLM watermarking embeds a statistical fingerprint in text: at each token, it partitions the vocabulary into "green" and "red" lists using a hash of previous tokens, then biases sampling toward green tokens. A detector counts green tokens — AI text has significantly more than random chance would predict.' },
    { emoji: '🔏', label: 'Steganography', text: 'Steganography hides secret messages inside innocent-looking images. LLM watermarking hides a statistical signal inside innocent-looking text. The key challenge: the watermark must survive paraphrasing, editing, and translation while remaining undetectable to humans. It\'s a cat-and-mouse game — stronger watermarks are easier to detect but may slightly degrade text quality.' },
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
