import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEHowLlmsProcessPrompts() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a translator reading a document written in a foreign language. They do not process the text letter by letter. Instead, they chunk the text into meaningful phrases (tokenization), map those phrases to concepts they know (embedding), consider how each phrase relates to every other phrase and the broader context (attention), and then produce.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The prompt string is split into tokens using a fixed vocabulary (typically 32K-100K+ tokens). The tokenizer is a deterministic algorithm, not a learned component — it runs before the neural network ever sees your input. GPT-4 uses cl100k_base (~100K vocab), Claude uses a similar BPE tokenizer.' },
    { emoji: '🔍', label: 'In Detail', text: 'An LLM processes your prompt through a similar pipeline, but with mathematical precision. Your text is broken into tokens (subword units), each token is converted into a high-dimensional vector (embedding), these vectors interact through layers of self-attention (the model\'s "reading" mechanism), and the output is generated one token at a time.' },
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
