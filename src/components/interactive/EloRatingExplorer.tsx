import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const INITIAL_MODELS = [
  { name: 'GPT-4o', trueStrength: 0.92, color: '#C76B4A' },
  { name: 'Claude 3.5', trueStrength: 0.91, color: '#8BA888' },
  { name: 'Gemini 1.5', trueStrength: 0.85, color: '#D4A843' },
  { name: 'LLaMA-3 70B', trueStrength: 0.80, color: '#7A8B9C' },
  { name: 'Mixtral 8x7B', trueStrength: 0.68, color: '#A67C94' },
];

export default function EloRatingExplorer() {
  const [ratings, setRatings] = useState<number[]>(INITIAL_MODELS.map(() => 1200));
  const [history, setHistory] = useState<number[][]>([INITIAL_MODELS.map(() => 1200)]);
  const [matchCount, setMatchCount] = useState(0);
  const [lastMatch, setLastMatch] = useState<string | null>(null);
  const K = 32;

  const runMatch = () => {
    const n = INITIAL_MODELS.length;
    const i = Math.floor(Math.random() * n);
    let j = Math.floor(Math.random() * (n - 1));
    if (j >= i) j++;

    const pWin = INITIAL_MODELS[i].trueStrength / (INITIAL_MODELS[i].trueStrength + INITIAL_MODELS[j].trueStrength);
    const noise = Math.random();
    const winner = noise < pWin ? i : j;
    const loser = winner === i ? j : i;

    const eW = 1 / (1 + Math.pow(10, (ratings[loser] - ratings[winner]) / 400));
    const eL = 1 - eW;

    const next = [...ratings];
    next[winner] = Math.round(next[winner] + K * (1 - eW));
    next[loser] = Math.round(next[loser] + K * (0 - eL));
    setRatings(next);
    setHistory([...history, [...next]]);
    setMatchCount(matchCount + 1);
    setLastMatch(`${INITIAL_MODELS[winner].name} beat ${INITIAL_MODELS[loser].name}`);
  };

  const runBatch = (count: number) => {
    let cur = [...ratings];
    const hist = [...history];
    let last = '';
    for (let m = 0; m < count; m++) {
      const n = INITIAL_MODELS.length;
      const i = Math.floor(Math.random() * n);
      let j = Math.floor(Math.random() * (n - 1));
      if (j >= i) j++;
      const pWin = INITIAL_MODELS[i].trueStrength / (INITIAL_MODELS[i].trueStrength + INITIAL_MODELS[j].trueStrength);
      const winner = Math.random() < pWin ? i : j;
      const loser = winner === i ? j : i;
      const eW = 1 / (1 + Math.pow(10, (cur[loser] - cur[winner]) / 400));
      const eL = 1 - eW;
      cur[winner] = Math.round(cur[winner] + K * (1 - eW));
      cur[loser] = Math.round(cur[loser] + K * (0 - eL));
      cur = [...cur];
      hist.push([...cur]);
      last = `${INITIAL_MODELS[winner].name} beat ${INITIAL_MODELS[loser].name}`;
    }
    setRatings(cur);
    setHistory(hist);
    setMatchCount(matchCount + count);
    setLastMatch(last);
  };

  const reset = () => {
    setRatings(INITIAL_MODELS.map(() => 1200));
    setHistory([INITIAL_MODELS.map(() => 1200)]);
    setMatchCount(0);
    setLastMatch(null);
  };

  const sorted = INITIAL_MODELS.map((m, i) => ({ ...m, elo: ratings[i], idx: i })).sort((a, b) => b.elo - a.elo);
  const maxElo = Math.max(...ratings, 1300);
  const minElo = Math.min(...ratings, 1100);

  // Simplified SVG chart of history
  const svgW = 320, svgH = 120, padL = 5, padR = 5;
  const plotW = svgW - padL - padR;
  const steps = history.length;
  const displayHistory = steps > 100 ? history.filter((_, i) => i % Math.ceil(steps / 100) === 0 || i === steps - 1) : history;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Elo Rating System Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Run matches and watch Elo ratings converge. Models have hidden "true strength" values.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={runMatch} style={{ padding: '0.35rem 0.7rem', borderRadius: '6px', border: '1px solid #C76B4A', background: 'rgba(199,107,74,0.08)', color: '#C76B4A', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
          +1 Match
        </button>
        <button onClick={() => runBatch(10)} style={{ padding: '0.35rem 0.7rem', borderRadius: '6px', border: '1px solid #C76B4A', background: 'rgba(199,107,74,0.08)', color: '#C76B4A', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500 }}>
          +10 Matches
        </button>
        <button onClick={() => runBatch(50)} style={{ padding: '0.35rem 0.7rem', borderRadius: '6px', border: '1px solid #D4A843', background: 'rgba(212,168,67,0.08)', color: '#D4A843', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500 }}>
          +50 Matches
        </button>
        <button onClick={reset} style={{ padding: '0.35rem 0.7rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: '#7A8B7C', fontSize: '0.78rem', cursor: 'pointer' }}>
          Reset
        </button>
        <span style={{ fontSize: '0.72rem', color: '#7A8B7C', alignSelf: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
          {matchCount} matches
        </span>
      </div>

      {/* Leaderboard */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        {sorted.map((m, rank) => (
          <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#7A8B7C', fontFamily: "'JetBrains Mono', monospace", width: '16px' }}>{rank + 1}</span>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: m.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', color: '#2C3E2D', width: '100px', flexShrink: 0 }}>{m.name}</span>
            <div style={{ flex: 1, height: '14px', background: '#E5DFD3', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.max(0, ((m.elo - minElo) / (maxElo - minElo)) * 100)}%`, height: '100%', background: m.color, borderRadius: '3px', transition: 'width 0.3s ease' }} />
            </div>
            <span style={{ fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: '#2C3E2D', width: '40px', textAlign: 'right' }}>{m.elo}</span>
          </div>
        ))}
      </div>

      {/* Rating history chart */}
      {displayHistory.length > 1 && (
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.3rem' }}>Rating History</div>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height={svgH}>
            {INITIAL_MODELS.map((m, mi) => {
              const path = displayHistory.map((h, hi) => {
                const x = padL + (hi / (displayHistory.length - 1)) * plotW;
                const y = svgH - 5 - ((h[mi] - minElo + 50) / (maxElo - minElo + 100)) * (svgH - 10);
                return `${hi === 0 ? 'M' : 'L'}${x},${y}`;
              }).join(' ');
              return <path key={m.name} d={path} fill="none" stroke={m.color} strokeWidth="1.5" opacity={0.7} />;
            })}
          </svg>
        </div>
      )}

      {lastMatch && (
        <div style={{ fontSize: '0.72rem', color: '#5A6B5C', textAlign: 'center' }}>
          Last match: <strong style={{ color: '#2C3E2D' }}>{lastMatch}</strong>
        </div>
      )}

      <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(139,168,136,0.08)', borderRadius: '6px', border: '1px solid rgba(139,168,136,0.2)' }}>
        <div style={{ fontSize: '0.7rem', color: '#5A6B5C', lineHeight: 1.5 }}>
          {matchCount < 20 ? 'Run more matches to see ratings converge. Early rankings are noisy and unreliable.' :
           matchCount < 100 ? 'Rankings are starting to stabilize but confidence intervals remain wide. More matches needed.' :
           'With 100+ matches, rankings are becoming reliable. Notice how stronger models settled at higher Elo scores.'}
        </div>
      </div>
    </div>
  );
}
