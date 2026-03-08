import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE04AttentionMechanismOrigins() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you\'re translating a long German sentence into English. Instead of first memorizing the entire German sentence and then writing the English version from memory, you keep the German text in front of you and glance back at different parts as you write each English word. When translating the verb, you look at the German verb.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Dzmitry Bahdanau, Kyunghyun Cho, and Yoshua Bengio at Universite de Montreal proposed what is now called additive or concatenation attention. At each decoder timestep t, the mechanism computes:  Alignment scores: e_&#123;t,i&#125; = v^T  tanh(W_a  s_&#123;t-1&#125; + U_a * h_i), where s_&#123;t-1&#125; is the decoder\'s previous hidden state and h_i is the encoder\'s hidden.' },
    { emoji: '🔍', label: 'In Detail', text: 'This is exactly what neural attention does. In a standard Seq2Seq model (03-sequence-to-sequence-models.md), the encoder compressed the entire input into a single fixed-length vector — a bottleneck that lost information for long sequences.' },
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
