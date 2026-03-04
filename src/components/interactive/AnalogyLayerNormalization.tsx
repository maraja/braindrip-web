import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyLayerNormalization() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎚', label: 'Sound Mixer', text: 'Layer normalization is like a sound engineer adjusting levels between songs. Some tracks come in whisper-quiet, others blasting. The mixer normalizes each track to a consistent volume (zero mean, unit variance) before applying EQ (learnable scale and shift). This prevents any one "channel" in the representation from drowning out the others.' },
    { emoji: '📏', label: 'Standardized Testing', text: 'Raw test scores vary wildly across classes. Layer norm is like converting to standardized scores: subtract the mean, divide by standard deviation. Now every student (token) is on the same scale. The learnable parameters (gamma, beta) then let the model decide: "actually, this dimension should be louder than that one."' },
    { emoji: '🌡', label: 'Thermostat', text: 'A thermostat keeps room temperature in a stable range regardless of outside weather. Layer norm is a thermostat for each token\'s representation: it detects when values drift too hot (large) or too cold (small) and recenters them to a comfortable range. This stability is critical for training very deep networks without values exploding or vanishing.' },
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
