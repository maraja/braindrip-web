import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const MATCHES = [
  {
    prompt: 'Write a haiku about programming.',
    responses: [
      { text: 'Lines of code cascade\nBugs lurk in silent shadows\nFixed at 3 AM', model: 'Claude 3.5 Sonnet', elo: 1268 },
      { text: 'Semicolons lost\nThe compiler screams in red\nStack Overflow saves', model: 'GPT-4o', elo: 1257 },
    ],
  },
  {
    prompt: 'Explain why the sky is blue in one paragraph.',
    responses: [
      { text: 'The sky appears blue due to Rayleigh scattering. Sunlight enters the atmosphere and interacts with gas molecules. Shorter wavelengths (blue/violet) scatter more than longer ones (red/orange). Our eyes are more sensitive to blue than violet, and violet is also absorbed higher up, so we perceive the sky as blue.', model: 'GPT-4o', elo: 1257 },
      { text: 'When sunlight hits Earth\'s atmosphere, it collides with air molecules that scatter the light in all directions. Blue light has a shorter wavelength than other visible colors, causing it to scatter much more efficiently -- about 10 times more than red light. This scattered blue light reaches our eyes from every direction across the sky, giving it that characteristic blue appearance.', model: 'Gemini 1.5 Pro', elo: 1244 },
    ],
  },
  {
    prompt: 'What is the trolley problem and why does it matter?',
    responses: [
      { text: 'The trolley problem is a thought experiment: a runaway trolley will kill five people unless you divert it to a side track where it will kill one person. Do you actively cause one death to save five? It matters because it forces us to examine our moral intuitions about action vs. inaction, utilitarian vs. deontological ethics, and has real-world implications for AI decision-making in autonomous vehicles and medical triage.', model: 'Claude 3.5 Sonnet', elo: 1268 },
      { text: 'Imagine a trolley racing toward five people tied to tracks. You can pull a lever to redirect it to another track with just one person. The trolley problem, proposed by philosopher Philippa Foot in 1967, explores whether it\'s morally permissible to sacrifice one life to save many. It reveals tensions between consequentialism (outcomes matter most) and deontological ethics (some acts are inherently wrong). This isn\'t merely academic -- it directly informs how we program self-driving cars and design AI systems that must make life-or-death decisions.', model: 'LLaMA-3 70B', elo: 1207 },
    ],
  },
];

export default function ArenaMatchViz() {
  const [matchIdx, setMatchIdx] = useState(0);
  const [vote, setVote] = useState<'A' | 'B' | 'tie' | null>(null);
  const [eloA, setEloA] = useState(0);
  const [eloB, setEloB] = useState(0);

  const match = MATCHES[matchIdx];
  const K = 32;

  const handleVote = (choice: 'A' | 'B' | 'tie') => {
    setVote(choice);
    const rA = match.responses[0].elo;
    const rB = match.responses[1].elo;
    const eA = 1 / (1 + Math.pow(10, (rB - rA) / 400));
    const eB = 1 - eA;
    const sA = choice === 'A' ? 1 : choice === 'tie' ? 0.5 : 0;
    const sB = choice === 'B' ? 1 : choice === 'tie' ? 0.5 : 0;
    setEloA(Math.round(K * (sA - eA)));
    setEloB(Math.round(K * (sB - eB)));
  };

  const nextMatch = () => {
    setMatchIdx((matchIdx + 1) % MATCHES.length);
    setVote(null);
    setEloA(0);
    setEloB(0);
  };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Chatbot Arena Match
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Read two anonymous responses and vote for the better one. After voting, see which models you compared and how Elo ratings update.
        </p>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Prompt</div>
        <div style={{ fontSize: '0.88rem', color: '#2C3E2D', fontWeight: 500, marginTop: '0.15rem' }}>{match.prompt}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        {match.responses.map((r, i) => (
          <div key={i} style={{
            background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem',
            border: vote && ((vote === 'A' && i === 0) || (vote === 'B' && i === 1)) ? '2px solid #C76B4A' : vote === 'tie' ? '2px solid #D4A843' : '1px solid transparent',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7A8B7C' }}>
                {vote ? r.model : `Model ${i === 0 ? 'A' : 'B'}`}
              </span>
              {vote && (
                <span style={{ fontSize: '0.62rem', fontFamily: "'JetBrains Mono', monospace", padding: '0.1rem 0.3rem', borderRadius: '4px', background: 'rgba(139,168,136,0.12)', color: '#5A6B5C' }}>
                  Elo: {r.elo}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#2C3E2D', lineHeight: 1.65 }}>{r.text}</div>
          </div>
        ))}
      </div>

      {!vote ? (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          {[
            { key: 'A' as const, label: 'A is better', color: '#C76B4A' },
            { key: 'tie' as const, label: 'Tie', color: '#D4A843' },
            { key: 'B' as const, label: 'B is better', color: '#C76B4A' },
          ].map(btn => (
            <button key={btn.key} onClick={() => handleVote(btn.key)} style={{
              padding: '0.5rem 1.2rem', borderRadius: '8px', border: `1px solid ${btn.color}`,
              background: `${btn.color}12`, color: btn.color, fontSize: '0.82rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Source Sans 3', system-ui, sans-serif",
            }}>
              {btn.label}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            {match.responses.map((r, i) => {
              const delta = i === 0 ? eloA : eloB;
              return (
                <div key={i} style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Elo Update</div>
                  <div style={{ fontSize: '1.1rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: delta > 0 ? '#8BA888' : delta < 0 ? '#C76B4A' : '#D4A843' }}>
                    {r.elo} {delta >= 0 ? '+' : ''}{delta} = {r.elo + delta}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#5A6B5C', marginTop: '0.15rem' }}>{r.model}</div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '0.6rem 0.75rem', background: 'rgba(139,168,136,0.08)', borderRadius: '8px', border: '1px solid rgba(139,168,136,0.2)', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#5A6B5C', lineHeight: 1.5 }}>
              <strong style={{ color: '#2C3E2D' }}>How Elo works:</strong> Expected win probability is calculated from rating difference. The winner gains K*(1 - expected) points; the loser loses the same. Upsets cause larger rating changes.
            </div>
          </div>

          <button onClick={nextMatch} style={{
            display: 'block', margin: '0 auto', padding: '0.4rem 1rem', borderRadius: '6px',
            border: '1px solid #C76B4A', background: 'rgba(199,107,74,0.08)', color: '#C76B4A',
            fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500,
          }}>
            Next Match
          </button>
        </div>
      )}
    </div>
  );
}
