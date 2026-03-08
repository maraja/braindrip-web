import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLExperienceReplay() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine studying for an exam by reading your textbook once, cover to cover, and never looking back. You would remember the last chapter vividly but forget the first. Now imagine keeping flashcards of key concepts and reviewing them in random order -- you would learn far more effectively. Experience replay is the flashcard system for RL agents.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A replay buffer (or replay memory) &#123;D&#125; is a fixed-size circular buffer that stores transitions:  [equation]  where d_t is a boolean terminal flag. When the buffer is full, the oldest transitions are overwritten.' },
    { emoji: '🔍', label: 'In Detail', text: 'The idea was first proposed by Lin (1992) and became a cornerstone of modern deep RL when it was adopted as a key component of DQN (Mnih et al., 2013). Without experience replay, training a neural network Q-function on sequential, correlated data is unstable and sample-wasteful.' },
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
