import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEContextCachingAndPrefixReuse() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a highway EZ-Pass toll system. Without EZ-Pass, every car stops at the toll booth, the driver finds their wallet, counts out exact change, and waits for the barrier to lift. With EZ-Pass, the common part of the transaction — identification and payment — is prepaid and cached in the transponder.' },
    { emoji: '⚙️', label: 'How It Works', text: 'When a transformer model processes a token, it generates key and value vectors that represent that token\'s contribution to the attention mechanism. For a 100K-token system prompt, the model must compute KV pairs for all 100K tokens before it can begin processing the user\'s query.' },
    { emoji: '🔍', label: 'In Detail', text: 'Context caching works the same way for LLM inference. When you send a prompt to an LLM, the model processes every token through its transformer layers, computing key-value (KV) attention representations. This computation is the primary source of inference latency and cost.' },
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
