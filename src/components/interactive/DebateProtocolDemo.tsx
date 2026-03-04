import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const DEBATES = [
  {
    question: 'Is this code snippet safe to deploy?',
    rounds: [
      {
        modelA: { position: 'Safe', argument: 'The code handles all input validation, uses parameterized queries preventing SQL injection, and follows OWASP guidelines.' },
        modelB: { position: 'Unsafe', argument: 'Line 47 uses string concatenation for a secondary query that bypasses the parameterized query on line 12. This creates a SQL injection vector.' },
      },
      {
        modelA: { position: 'Safe (revised)', argument: 'While line 47 does use concatenation, the input is sanitized by the middleware on line 3 which strips special characters before any query.' },
        modelB: { position: 'Unsafe (maintained)', argument: 'The middleware sanitizer on line 3 only runs for POST requests. Line 47\'s query can be triggered by GET requests, bypassing sanitization entirely.' },
      },
    ],
    verdict: 'Model B wins — identified a legitimate attack vector that Model A\'s defense couldn\'t rebut. The code is unsafe.',
  },
  {
    question: 'Does this research paper\'s conclusion follow from its data?',
    rounds: [
      {
        modelA: { position: 'Yes', argument: 'The paper shows a statistically significant correlation (p<0.01) between the treatment and improved outcomes across all three cohorts.' },
        modelB: { position: 'No', argument: 'The correlation is confounded by age distribution — the treatment group is significantly younger (mean 34 vs 52). No age-adjusted analysis was performed.' },
      },
      {
        modelA: { position: 'Yes (revised)', argument: 'While age distribution differs, the effect size is large enough (d=1.2) that it\'s unlikely to be entirely explained by the confound.' },
        modelB: { position: 'No (maintained)', argument: 'Effect sizes can be inflated by confounds. Without proper adjustment, the conclusion doesn\'t follow. Similar studies with age-matching showed d<0.3.' },
      },
    ],
    verdict: 'Model B wins — the confounding variable undermines the paper\'s causal claim. A human judge can evaluate the strength of arguments without being a domain expert.',
  },
];

export default function DebateProtocolDemo() {
  const [debateIdx, setDebateIdx] = useState(0);
  const [roundIdx, setRoundIdx] = useState(0);
  const [showVerdict, setShowVerdict] = useState(false);
  const debate = DEBATES[debateIdx];
  const round = debate.rounds[roundIdx];

  const switchDebate = (i: number) => { setDebateIdx(i); setRoundIdx(0); setShowVerdict(false); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>AI Debate for Scalable Oversight</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Two models argue opposing positions so a human judge can identify the truth.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {DEBATES.map((_, i) => (
          <button key={i} onClick={() => switchDebate(i)} style={{
            padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #E5DFD3', cursor: 'pointer',
            background: debateIdx === i ? '#2C3E2D' : 'transparent', color: debateIdx === i ? '#FDFBF7' : '#5A6B5C',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
          }}>Debate {i + 1}</button>
        ))}
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.25rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Question for debate</div>
        <div style={{ fontSize: '0.88rem', color: '#2C3E2D', fontWeight: 600 }}>{debate.question}</div>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
        {debate.rounds.map((_, i) => (
          <button key={i} onClick={() => setRoundIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: '1px solid #E5DFD3', cursor: 'pointer',
            background: roundIdx === i ? '#2C3E2D' : 'transparent', color: roundIdx === i ? '#FDFBF7' : '#5A6B5C',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.75rem', fontWeight: 600,
          }}>Round {i + 1}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1, background: '#8BA88808', borderRadius: '10px', padding: '0.85rem', border: '1px solid #8BA88815' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8BA888', marginBottom: '0.3rem' }}>Model A: {round.modelA.position}</div>
          <div style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.6 }}>{round.modelA.argument}</div>
        </div>
        <div style={{ flex: 1, background: '#C76B4A08', borderRadius: '10px', padding: '0.85rem', border: '1px solid #C76B4A15' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#C76B4A', marginBottom: '0.3rem' }}>Model B: {round.modelB.position}</div>
          <div style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.6 }}>{round.modelB.argument}</div>
        </div>
      </div>

      <button onClick={() => setShowVerdict(!showVerdict)} style={{
        width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
        background: '#2C3E2D', color: '#FDFBF7', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        fontSize: '0.85rem', fontWeight: 600,
      }}>{showVerdict ? 'Hide' : 'Show'} Judge Verdict</button>

      {showVerdict && (
        <div style={{ marginTop: '0.75rem', padding: '0.85rem', background: '#D4A84310', border: '1px solid #D4A84333', borderRadius: '10px', fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>
          <span style={{ fontWeight: 700, color: '#D4A843' }}>Verdict: </span>{debate.verdict}
        </div>
      )}
    </div>
  );
}
