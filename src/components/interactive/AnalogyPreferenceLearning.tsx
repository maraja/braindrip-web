import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyPreferenceLearning() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🍷', label: 'Wine Tasting', text: 'Different wine competitions use different scoring methods: some rank wines head-to-head (DPO), some use numbered scores (reward modeling), some weight recent vintages more (IPO). Preference learning variants are different methods for converting human "I prefer A over B" judgments into model improvements. Each variant has tradeoffs in stability, sample efficiency, and resistance to overfitting.' },
    { emoji: '🗳', label: 'Voting Systems', text: 'Elections can use different voting systems: ranked choice, approval voting, score voting. Similarly, preference learning has many variants: DPO uses pairwise comparisons directly, IPO adds a regularization term to prevent overfitting, KTO works with just thumbs-up/down (no pairwise data needed), and ORPO combines SFT and preference learning in one step. Each "voting system" extracts slightly different signals from human preferences.' },
    { emoji: '🎓', label: 'Teaching Styles', text: 'Some teachers grade by comparison ("essay A is better than B"), others by absolute score, others by pass/fail. Preference learning variants differ in how they use feedback: DPO needs explicit pairs, KTO needs only binary feedback per response, SimPO simplifies by using sequence likelihood as implicit reward, and SPPO uses self-play. Each approach works with different types and amounts of human feedback data.' },
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
