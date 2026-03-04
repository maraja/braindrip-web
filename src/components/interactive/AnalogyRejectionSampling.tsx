import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyRejectionSampling() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎰', label: 'Best of N', text: 'Rejection sampling is like pulling a slot machine N times and keeping only the best result. The model generates N candidate responses to a prompt, a reward model scores each one, and only the top-scoring response is kept for training. Simple but effective: if any of the N samples is good, you capture it. Typically N=8 to 64 gives substantial quality improvements.' },
    { emoji: '📸', label: 'Photo Shoot', text: 'A photographer takes dozens of shots of the same subject and keeps only the best ones for the portfolio. Rejection sampling generates many responses, filters for quality using a reward model, and trains on the cream of the crop. This creates a high-quality synthetic dataset from the model\'s own outputs — better than its average generation but achievable by its own capabilities.' },
    { emoji: '🎣', label: 'Catch & Release', text: 'A fisherman catches many fish but keeps only those above a size threshold, releasing the rest. Rejection sampling generates many responses, scores them with a reward model, and keeps only those above a quality threshold. The kept responses form a curated training set. This is simpler than RL but still very effective — it distills the model\'s best behaviors into its default behavior.' },
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
