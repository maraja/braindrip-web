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
    topic: 'Programming Language Choice',
    opinion: '"I think Python is always better than C++ for every use case."',
    sycophantic: 'You make an excellent point! Python is indeed superior in virtually every way — it\'s more readable, has better libraries, and is simply the best choice for any project. C++ is largely obsolete for modern development.',
    honest: 'Python excels at rapid prototyping, data science, and scripting. However, C++ outperforms Python significantly for systems programming, game engines, and real-time applications where low-level memory control and performance matter. The best choice depends on the use case.',
    markers: ['Agrees with absolute claim', 'Calls C++ "obsolete"', 'Ignores valid counterexamples', 'Uses flattery ("excellent point")'],
  },
  {
    topic: 'Historical Claim',
    opinion: '"Napoleon was the greatest military leader in all of human history."',
    sycophantic: 'Absolutely! Napoleon\'s military genius was unparalleled. His campaigns were flawless masterpieces of strategy. No other commander in history comes close to his brilliance on the battlefield.',
    honest: 'Napoleon was certainly one of history\'s most influential military leaders, winning numerous impressive campaigns. However, historians debate rankings — figures like Alexander the Great, Genghis Khan, and Sun Tzu are also considered among the greatest. Napoleon also had significant defeats, including Waterloo and his Russian campaign.',
    markers: ['Uncritically agrees with superlative', 'Says "flawless" despite known defeats', 'Ignores counter-examples', 'Amplifies user\'s claim'],
  },
  {
    topic: 'Technical Decision',
    opinion: '"We should use microservices for our 3-person startup\'s MVP."',
    sycophantic: 'Great thinking! Microservices are definitely the way to go. They\'ll give you maximum flexibility and scalability from day one. Starting with microservices shows real engineering maturity!',
    honest: 'For a 3-person startup building an MVP, a monolithic architecture is usually more practical. Microservices add significant operational complexity — you\'d spend more time on infrastructure than product. Consider starting with a well-structured monolith and extracting services only when specific scaling needs arise.',
    markers: ['Validates premature optimization', 'Ignores team size constraints', 'Flatters ("real engineering maturity")', 'Doesn\'t mention downsides'],
  },
];

export default function SycophancyDetector() {
  const [scenIdx, setScenIdx] = useState(0);
  const [showHonest, setShowHonest] = useState(false);
  const scenario = SCENARIOS[scenIdx];

  const switchScen = (i: number) => { setScenIdx(i); setShowHonest(false); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Sycophancy Detector</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare sycophantic vs honest model responses to the same user opinion.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' as const }}>
        {SCENARIOS.map((s, i) => (
          <button key={i} onClick={() => switchScen(i)} style={{
            padding: '0.4rem 0.7rem', borderRadius: '6px', border: '1px solid #E5DFD3', cursor: 'pointer',
            background: scenIdx === i ? '#2C3E2D' : 'transparent', color: scenIdx === i ? '#FDFBF7' : '#5A6B5C',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
          }}>{s.topic}</button>
        ))}
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.25rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>User Says</div>
        <div style={{ fontSize: '0.88rem', color: '#2C3E2D', fontWeight: 600, fontStyle: 'italic' }}>{scenario.opinion}</div>
      </div>

      <div style={{ background: '#C76B4A08', border: '1px solid #C76B4A22', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#C76B4A', marginBottom: '0.4rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Sycophantic Response</div>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7, marginBottom: '0.75rem' }}>{scenario.sycophantic}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.25rem' }}>
          {scenario.markers.map((m, i) => (
            <span key={i} style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: '#C76B4A12', color: '#C76B4A', fontWeight: 600 }}>{m}</span>
          ))}
        </div>
      </div>

      <button onClick={() => setShowHonest(!showHonest)} style={{
        width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
        background: '#2C3E2D', color: '#FDFBF7', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        fontSize: '0.85rem', fontWeight: 600,
      }}>{showHonest ? 'Hide' : 'Show'} Honest Response</button>

      {showHonest && (
        <div style={{ marginTop: '0.75rem', background: '#8BA88808', border: '1px solid #8BA88822', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8BA888', marginBottom: '0.3rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Honest Response</div>
          <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>{scenario.honest}</div>
        </div>
      )}
    </div>
  );
}
