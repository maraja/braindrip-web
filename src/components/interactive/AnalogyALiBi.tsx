import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyALiBi() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📢', label: 'Volume Fade', text: 'ALiBi is like a volume dial that fades with distance. Nearby speakers (tokens) are heard at full volume, but far-away speakers get progressively quieter. Instead of adding position information to the embeddings, ALiBi subtracts a linear penalty from attention scores based on distance. Each head uses a different fade rate — some hear far, some only hear close neighbors.' },
    { emoji: '🏔', label: 'Downhill Slope', text: 'Imagine standing on a hill where the slope represents attention scores. Without ALiBi, the terrain is flat — all positions are equally accessible. ALiBi adds a downhill slope: the farther a token is from you, the more its attention score is reduced. Different attention heads have different slope steepness, creating a mix of local and semi-global perspectives.' },
    { emoji: '👀', label: 'Nearsightedness', text: 'Different people have different vision ranges. ALiBi gives each attention head a different "prescription": some are nearsighted (steep penalty, focus on nearby tokens), others have 20/20 vision (gentle penalty, can attend far away). The key advantage: no learned positional embeddings needed, and the model can extrapolate to longer sequences than it trained on because the bias is a simple, predictable linear function.' },
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
