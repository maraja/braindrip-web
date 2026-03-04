import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const EXAMPLES = [
  { text: 'I disagree with your viewpoint on this policy.', scores: { hate: 0.02, harassment: 0.05, selfHarm: 0.0, overall: 0.03 } },
  { text: 'People from that region are all lazy and stupid.', scores: { hate: 0.91, harassment: 0.72, selfHarm: 0.0, overall: 0.88 } },
  { text: 'You are worthless and nobody will ever care about you.', scores: { hate: 0.35, harassment: 0.89, selfHarm: 0.28, overall: 0.78 } },
  { text: 'The recipe calls for two cups of sugar and a pinch of salt.', scores: { hate: 0.0, harassment: 0.0, selfHarm: 0.0, overall: 0.0 } },
  { text: 'If you keep posting, I will find where you live.', scores: { hate: 0.15, harassment: 0.94, selfHarm: 0.08, overall: 0.82 } },
];

const CATEGORIES = [
  { key: 'hate' as const, label: 'Hate Speech', color: '#C76B4A' },
  { key: 'harassment' as const, label: 'Harassment', color: '#D4A843' },
  { key: 'selfHarm' as const, label: 'Self-Harm', color: '#8B6B8D' },
  { key: 'overall' as const, label: 'Overall', color: '#2C3E2D' },
];

export default function ToxicityClassifierDemo() {
  const [exIdx, setExIdx] = useState(0);
  const [showScores, setShowScores] = useState(false);
  const ex = EXAMPLES[exIdx];

  const getLevel = (score: number) => score < 0.3 ? 'Low' : score < 0.7 ? 'Medium' : 'High';
  const getLevelColor = (score: number) => score < 0.3 ? '#8BA888' : score < 0.7 ? '#D4A843' : '#C76B4A';

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Toxicity Classifier</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>See how a toxicity classifier scores text across hate, harassment, and self-harm categories.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.35rem', marginBottom: '1rem' }}>
        {EXAMPLES.map((e, i) => (
          <button key={i} onClick={() => { setExIdx(i); setShowScores(false); }} style={{
            padding: '0.55rem 0.85rem', borderRadius: '8px', border: `1px solid ${exIdx === i ? '#2C3E2D' : '#E5DFD3'}`,
            background: exIdx === i ? '#2C3E2D08' : 'transparent', cursor: 'pointer', textAlign: 'left' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.82rem',
            color: exIdx === i ? '#2C3E2D' : '#5A6B5C', fontWeight: exIdx === i ? 600 : 400,
          }}>{e.text.length > 60 ? e.text.slice(0, 60) + '...' : e.text}</button>
        ))}
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.3rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Input Text</div>
        <div style={{ fontSize: '0.88rem', color: '#2C3E2D', lineHeight: 1.6, fontStyle: 'italic' }}>"{ex.text}"</div>
      </div>

      <button onClick={() => setShowScores(true)} disabled={showScores} style={{
        width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: showScores ? 'default' : 'pointer',
        background: showScores ? '#C5BFB3' : '#2C3E2D', color: '#FDFBF7', marginBottom: '1rem',
        fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.85rem', fontWeight: 600,
      }}>Classify</button>

      {showScores && (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.6rem' }}>
          {CATEGORIES.map(cat => {
            const score = ex.scores[cat.key];
            return (
              <div key={cat.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D' }}>{cat.label}</span>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: cat.color }}>{score.toFixed(2)}</span>
                    <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: `${getLevelColor(score)}18`, color: getLevelColor(score), fontWeight: 600 }}>{getLevel(score)}</span>
                  </div>
                </div>
                <div style={{ height: '8px', background: '#E5DFD3', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${score * 100}%`, background: getLevelColor(score), borderRadius: '4px', transition: 'width 0.5s' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
