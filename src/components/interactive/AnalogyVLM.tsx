import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyVLM() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '👁️‍🗨️', label: 'Art Critic', text: 'An art critic can look at a painting and articulate what they see, explain the technique, and discuss its meaning — combining visual perception with language fluency. Vision-language models pair a visual encoder (the "eyes" that convert images to embeddings) with a language model (the "voice" that reasons and speaks). A projection layer bridges the two, mapping image features into the language model\'s token space.' },
    { emoji: '🔌', label: 'Adapter Cable', text: 'A VLM connects a vision encoder (like ViT or SigLIP) to an LLM using an adapter — like an HDMI-to-USB-C cable between a monitor and laptop. The vision encoder sees the image, the adapter translates visual features into "tokens" the language model understands, and the LLM reasons about them using its language capabilities. Models like LLaVA, GPT-4V, and Claude do this to answer questions about images.' },
    { emoji: '🧩', label: 'Two-Piece Puzzle', text: 'A VLM is a two-piece puzzle: a pre-trained vision model that extracts image features, and a pre-trained language model that processes text. The research challenge is in the connector — how to align visual and textual representations so the LLM can "see." Different architectures use different connectors: linear projections (LLaVA), cross-attention layers (Flamingo), or Q-Former modules (BLIP-2), each with different tradeoffs.' },
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
