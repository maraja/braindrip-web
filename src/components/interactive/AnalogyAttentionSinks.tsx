import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyAttentionSinks() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🗑', label: 'Junk Drawer', text: 'Every home has a junk drawer where miscellaneous items end up. Attention sinks are like that: the first token (often <BOS>) becomes a "dump" where attention goes when no other token is truly relevant. The model learns to park excess attention probability on this token rather than spreading noise across all positions.' },
    { emoji: '⚡', label: 'Ground Wire', text: 'In electrical circuits, the ground wire safely absorbs excess current. Attention sinks serve a similar function: they absorb "leftover" attention that does not meaningfully belong anywhere. Without this grounding token, removing the first few tokens from a long sequence causes the model to break — the excess attention has nowhere to go.' },
    { emoji: '🅿️', label: 'Overflow Parking', text: 'An overflow parking lot catches cars that do not fit in the main lot. The initial tokens act as overflow parking for attention — when softmax forces the model to distribute probability somewhere, these sinks gracefully absorb it. Keeping just a few sink tokens lets sliding-window models handle infinitely long sequences stably.' },
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
