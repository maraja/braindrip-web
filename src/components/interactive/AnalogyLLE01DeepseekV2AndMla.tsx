import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE01DeepseekV2AndMla() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Serving large language models is expensive primarily because of one bottleneck: the key-value (KV) cache. During autoregressive generation, models must store the key and value vectors for every previous token across every attention head. This cache grows linearly with sequence length and consumes enormous amounts of GPU memory.' },
    { emoji: '⚙️', label: 'How It Works', text: 'In standard multi-head attention (MHA), each attention head maintains separate key (K) and value (V) vectors for every token in the context. For a model with, say, 128 heads and 128 dimensions per head, each token requires storing 2 x 128 x 128 = 32,768 values in the KV cache. For a 100K-token context, this becomes a massive memory footprint.' },
    { emoji: '🔍', label: 'In Detail', text: 'Multi-head Latent Attention was DeepSeek\'s answer to this problem. Released in May 2024 by DeepSeek, a Hangzhou-based AI lab backed by the quantitative hedge fund High-Flyer Capital, V2 was a 236 billion parameter mixture-of-experts model with only 21 billion active parameters per token. But its most consequential innovation was not scale.' },
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
