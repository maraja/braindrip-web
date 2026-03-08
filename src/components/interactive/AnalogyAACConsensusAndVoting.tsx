import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACConsensusAndVoting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine asking a room of 100 people to estimate the number of jellybeans in a jar. Individual guesses will be wildly inaccurate — some too high, some too low. But the average of all 100 guesses will be remarkably close to the true number. This is the "wisdom of crowds" effect: independent errors tend to cancel out when aggregated.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest consensus mechanism:  N agents (or N samples from one agent) independently answer the same question. Each answer is normalized (e.g., extracting the final numerical answer or classification label). The answer that appears most frequently is selected.' },
    { emoji: '🔍', label: 'In Detail', text: 'Consensus mechanisms in AI agent systems range from simple (majority vote across 5 responses) to sophisticated (structured debate followed by weighted judgment). The simplest form — self-consistency — does not even require multiple agents: you sample multiple chain-of-thought reasoning paths from the same model and take the most common final.' },
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
