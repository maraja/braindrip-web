import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE09SpeculativeDecodingAndInferenceSpeedups() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine an executive who reviews and signs documents. Reading and approving a correct document takes seconds; writing one from scratch takes hours. Now imagine an assistant who drafts documents for the executive to review. The assistant works quickly but makes occasional mistakes.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Two groups independently published the core algorithm in 2023: Leviathan, Kalman, and Matias at Google ("Fast Inference from Transformers via Speculative Decoding") and Chen, Borgeaud, et al. at DeepMind ("Accelerating Large Language Model Decoding with Speculative Sampling"). The algorithm works as follows: (1) A small draft model (e.g.' },
    { emoji: '🔍', label: 'In Detail', text: 'Speculative decoding applies this insight to language model inference. The fundamental bottleneck of autoregressive generation is that each token requires a full forward pass through the model, and tokens must be generated sequentially — you cannot generate token 5 without first generating tokens 1 through 4.' },
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
