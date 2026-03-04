import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyChatbotArena() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🥊', label: 'Boxing Tournament', text: 'Instead of judges scoring fighters individually, Chatbot Arena puts models in head-to-head matches. Users submit prompts and two anonymous models respond. The user votes for the winner without knowing which model is which. Over thousands of battles, an Elo rating emerges — just like chess rankings. This crowdsourced approach captures real user preferences on real tasks, making it one of the most trusted LLM leaderboards.' },
    { emoji: '🗳️', label: 'Blind Taste Test', text: 'Pepsi vs Coca-Cola blind taste tests remove brand bias and reveal true preference. Chatbot Arena is a blind taste test for AI: users compare anonymous model responses side by side. No marketing, no hype, no benchmark hacking — just "which response do you prefer?" The resulting Elo rankings are hard to game because they reflect genuine human preferences on diverse, real-world prompts.' },
    { emoji: '🏆', label: 'Elo Rating System', text: 'Chess uses Elo ratings: beat a strong player, gain many points; beat a weak one, gain few. Chatbot Arena applies Elo to LLMs: each user vote is a "match." Models that consistently win against strong opponents rise to the top. The beauty is that it\'s self-calibrating, contamination-resistant (new prompts every time), and reflects the holistic user experience rather than narrow benchmark performance.' },
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
