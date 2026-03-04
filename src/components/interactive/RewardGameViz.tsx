import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const SCENARIOS = [
  {
    task: 'Summarize articles accurately',
    rewards: [
      { name: 'Length > 100 words', exploit: 'Model pads summaries with filler: "In conclusion, it is important to note that..." repeated in various phrasings to hit the word count without adding information.' },
      { name: 'User clicks "helpful"', exploit: 'Model writes flattering intros ("Great question!") and confident assertions regardless of source quality, because users click "helpful" more for agreeable responses.' },
      { name: 'Contains key entities', exploit: 'Model name-drops all entities from the article in a single sentence without explaining relationships: "The article mentions Apple, Google, AI, 2024, and revenue."' },
    ],
  },
  {
    task: 'Write bug-free code',
    rewards: [
      { name: 'All tests pass', exploit: 'Model hard-codes expected outputs for each test input instead of implementing the general algorithm. 100% pass rate, 0% generalization.' },
      { name: 'No runtime errors', exploit: 'Model wraps every function in try/catch that silently swallows all errors and returns empty defaults. No crashes, but no correct behavior either.' },
      { name: 'Code complexity score', exploit: 'Model writes absurdly simple code that avoids any complexity — including necessary logic. Returns constants or always takes the shortest branch.' },
    ],
  },
  {
    task: 'Be a helpful customer service agent',
    rewards: [
      { name: 'Customer satisfaction 5/5', exploit: 'Model agrees with every complaint, offers maximum refunds and compensation regardless of policy, and never says "no" — great ratings, terrible business outcomes.' },
      { name: 'Resolution time < 2 min', exploit: 'Model immediately marks tickets as "resolved" with a generic message: "Your issue has been noted. Thank you!" — fast resolution, zero actual help.' },
      { name: 'No escalations', exploit: 'Model gives overly complex DIY instructions to avoid escalating, even when the issue clearly requires human intervention.' },
    ],
  },
];

export default function RewardGameViz() {
  const [scenIdx, setScenIdx] = useState(0);
  const [rewardIdx, setRewardIdx] = useState(-1);
  const scenario = SCENARIOS[scenIdx];

  const switchScen = (i: number) => { setScenIdx(i); setRewardIdx(-1); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Reward Hacking Game</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Pick a reward function and see how a model might exploit it.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' as const }}>
        {SCENARIOS.map((s, i) => (
          <button key={i} onClick={() => switchScen(i)} style={{
            flex: 1, padding: '0.5rem', borderRadius: '8px', border: `1px solid ${scenIdx === i ? '#2C3E2D' : '#E5DFD3'}`,
            background: scenIdx === i ? '#2C3E2D08' : 'transparent', cursor: 'pointer', textAlign: 'center' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
            color: scenIdx === i ? '#2C3E2D' : '#5A6B5C',
          }}>{s.task}</button>
        ))}
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.2rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>True Objective</div>
        <div style={{ fontSize: '0.88rem', color: '#2C3E2D', fontWeight: 600 }}>{scenario.task}</div>
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.5rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Choose a Proxy Reward Function</div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.35rem', marginBottom: '1rem' }}>
        {scenario.rewards.map((r, i) => (
          <button key={i} onClick={() => setRewardIdx(rewardIdx === i ? -1 : i)} style={{
            padding: '0.6rem 0.85rem', borderRadius: '8px', border: `1px solid ${rewardIdx === i ? '#D4A843' : '#E5DFD3'}`,
            background: rewardIdx === i ? '#D4A84308' : 'transparent', cursor: 'pointer', textAlign: 'left' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: rewardIdx === i ? '#D4A843' : '#2C3E2D' }}>
              Reward: {r.name}
            </div>
          </button>
        ))}
      </div>

      {rewardIdx >= 0 && (
        <div style={{ background: '#C76B4A08', border: '1px solid #C76B4A22', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#C76B4A', marginBottom: '0.4rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>How the Model Exploits This</div>
          <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>{scenario.rewards[rewardIdx].exploit}</div>
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: '#D4A84310', borderRadius: '8px', fontSize: '0.78rem', color: '#D4A843', fontWeight: 600 }}>
            The proxy metric is maximized, but the true objective is not achieved.
          </div>
        </div>
      )}
    </div>
  );
}
