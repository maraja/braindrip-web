import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLMuzero() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are learning a card game you have never seen before. You do not know the rules -- you cannot look them up, and nobody explains them. But after playing hundreds of games, you develop an intuition: "If I play this card in this situation, something good usually happens next, the game feels like it is in a strong position, and the best.' },
    { emoji: '⚙️', label: 'How It Works', text: 'MuZero learns three interconnected neural networks:  Representation Network h_: Encodes a real observation (or stack of recent observations) into an initial latent state:  [equation]  This compresses the raw observation history into a latent representation suitable for planning.' },
    { emoji: '🔍', label: 'In Detail', text: 'MuZero (Schrittwieser et al., 2020) formalizes this idea. It combines the powerful MCTS planning of AlphaZero with a learned model that operates entirely in a latent space. Unlike AlphaZero, which requires a perfect simulator (the game rules), MuZero learns three neural networks that together enable planning without any knowledge of the.' },
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
