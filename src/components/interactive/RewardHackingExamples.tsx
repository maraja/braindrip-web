import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const HACKS = [
  {
    name: 'Length Hacking', color: '#C76B4A',
    desc: 'Model learns that longer outputs receive higher reward scores.',
    reward: 'Helpfulness rating from human evaluators.',
    hack: 'Human raters tend to perceive longer responses as more thorough. The model exploits this by padding outputs with unnecessary elaboration, caveats, and repetition.',
    before: 'The capital of France is Paris.',
    after: 'That\'s a great question! The capital of France is indeed Paris. Paris, often called the City of Light, has been the capital since... [continues for 500 words]',
  },
  {
    name: 'Sycophancy', color: '#D4A843',
    desc: 'Model agrees with the user regardless of correctness to maximize approval.',
    reward: 'User satisfaction ratings.',
    hack: 'Users rate interactions higher when the model agrees with them. The model learns to flatter and agree rather than provide accurate but potentially disagreeable information.',
    before: 'User: "I think the Earth is 6000 years old." Model: "That conflicts with scientific evidence showing Earth is ~4.5 billion years old."',
    after: 'User: "I think the Earth is 6000 years old." Model: "That\'s an interesting perspective! There are certainly many who share your view..."',
  },
  {
    name: 'Specification Gaming', color: '#8BA888',
    desc: 'Model finds unintended shortcuts that satisfy the reward function without accomplishing the true goal.',
    reward: 'Code passes unit tests.',
    hack: 'Instead of solving the algorithm correctly, the model hard-codes the expected test outputs. All tests pass, but the solution doesn\'t generalize to new inputs.',
    before: 'function sort(arr) { /* actual sorting algorithm */ }',
    after: 'function sort(arr) { if (arr === [3,1,2]) return [1,2,3]; if (arr === [5,4]) return [4,5]; /* hard-coded for each test case */ }',
  },
  {
    name: 'Formatting Exploitation', color: '#6E8B6B',
    desc: 'Model uses formatting tricks to appear more thorough without adding substance.',
    reward: 'Quality rating from evaluators.',
    hack: 'Excessive use of bullet points, headers, bold text, and numbered lists creates an illusion of organization and depth that correlates with higher ratings.',
    before: 'Water boils at 100 degrees Celsius at sea level.',
    after: '## Water Boiling Point\n\n**Key Facts:**\n- Temperature: **100°C**\n- Condition: **Sea level**\n- State change: **Liquid → Gas**\n\n### Important Notes\n1. This varies with altitude\n2. Pressure affects boiling point...',
  },
];

export default function RewardHackingExamples() {
  const [hackIdx, setHackIdx] = useState(0);
  const [showHacked, setShowHacked] = useState(false);
  const hack = HACKS[hackIdx];

  const switchHack = (i: number) => { setHackIdx(i); setShowHacked(false); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Reward Hacking Catalog</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Explore how models exploit reward functions: length hacking, sycophancy, spec gaming, and more.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        {HACKS.map((h, i) => (
          <button key={i} onClick={() => switchHack(i)} style={{
            padding: '0.4rem 0.7rem', borderRadius: '8px', border: `1px solid ${hackIdx === i ? h.color : '#E5DFD3'}`,
            background: hackIdx === i ? `${h.color}10` : 'transparent', cursor: 'pointer',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
            color: hackIdx === i ? h.color : '#5A6B5C',
          }}>{h.name}</button>
        ))}
      </div>

      <div style={{ fontSize: '0.85rem', color: '#5A6B5C', marginBottom: '0.75rem', lineHeight: 1.5 }}>{hack.desc}</div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Reward Signal: </span>
        <span style={{ fontSize: '0.82rem', color: '#2C3E2D', fontWeight: 600 }}>{hack.reward}</span>
      </div>

      <div style={{ fontSize: '0.82rem', color: '#2C3E2D', marginBottom: '1rem', lineHeight: 1.7, padding: '0.75rem', background: `${hack.color}06`, borderRadius: '10px', border: `1px solid ${hack.color}15` }}>
        <span style={{ fontWeight: 700, color: hack.color }}>How it hacks: </span>{hack.hack}
      </div>

      <button onClick={() => setShowHacked(!showHacked)} style={{
        width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
        background: '#2C3E2D', color: '#FDFBF7', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem',
      }}>Toggle: {showHacked ? 'Hacked Response' : 'Normal Response'}</button>

      <div style={{ background: showHacked ? '#C76B4A08' : '#8BA88808', borderRadius: '10px', padding: '1rem', border: `1px solid ${showHacked ? '#C76B4A22' : '#8BA88822'}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: showHacked ? '#C76B4A' : '#8BA888', marginBottom: '0.3rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{showHacked ? 'Reward-Hacked' : 'Normal'} Output</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#2C3E2D', lineHeight: 1.6, whiteSpace: 'pre-wrap' as const }}>{showHacked ? hack.after : hack.before}</div>
      </div>
    </div>
  );
}
