import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const SENTENCES: Record<string, { tokens: string[]; logProbs: number[] }> = {
  'The cat sat on the mat': {
    tokens: ['The', 'cat', 'sat', 'on', 'the', 'mat'],
    logProbs: [-2.1, -3.2, -2.8, -1.5, -0.8, -3.5],
  },
  'The dog chased the ball': {
    tokens: ['The', 'dog', 'chased', 'the', 'ball'],
    logProbs: [-2.1, -3.5, -3.1, -0.9, -2.6],
  },
  'Colorless green ideas sleep furiously': {
    tokens: ['Colorless', 'green', 'ideas', 'sleep', 'furiously'],
    logProbs: [-9.2, -5.8, -6.4, -7.1, -8.3],
  },
  'The president of the United States': {
    tokens: ['The', 'president', 'of', 'the', 'United', 'States'],
    logProbs: [-2.1, -4.2, -0.6, -0.4, -1.8, -0.5],
  },
  'I enjoy eating pizza on Fridays': {
    tokens: ['I', 'enjoy', 'eating', 'pizza', 'on', 'Fridays'],
    logProbs: [-1.8, -4.1, -2.9, -3.6, -1.2, -4.5],
  },
};

const SENTENCE_KEYS = Object.keys(SENTENCES);

export default function PerplexityCalculator() {
  const [selIdx, setSelIdx] = useState(0);
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);
  const sent = SENTENCES[SENTENCE_KEYS[selIdx]];

  const avgNegLogProb = sent.logProbs.reduce((a, b) => a + b, 0) / sent.logProbs.length;
  const perplexity = Math.exp(-avgNegLogProb);
  const maxAbsLP = Math.max(...sent.logProbs.map(Math.abs));

  const getTokenColor = (lp: number) => {
    const ratio = Math.abs(lp) / 10;
    if (ratio < 0.25) return '#8BA888';
    if (ratio < 0.5) return '#D4A843';
    return '#C76B4A';
  };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Perplexity Calculator
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Explore how perplexity measures a model's surprise at text. Lower perplexity means more predictable text.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {SENTENCE_KEYS.map((s, i) => (
          <button key={s} onClick={() => { setSelIdx(i); setHoveredToken(null); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px',
            border: `1px solid ${selIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: selIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent',
            color: selIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: selIdx === i ? 600 : 400,
            fontSize: '0.72rem', cursor: 'pointer',
          }}>
            {s.length > 28 ? s.slice(0, 28) + '...' : s}
          </button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          Tokens (hover to inspect)
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {sent.tokens.map((t, i) => (
            <span key={i} onMouseEnter={() => setHoveredToken(i)} onMouseLeave={() => setHoveredToken(null)} style={{
              padding: '0.3rem 0.5rem', borderRadius: '5px', fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s ease',
              background: hoveredToken === i ? getTokenColor(sent.logProbs[i]) + '25' : '#FDFBF7',
              border: `1px solid ${hoveredToken === i ? getTokenColor(sent.logProbs[i]) : '#E5DFD3'}`,
              color: '#2C3E2D', fontWeight: hoveredToken === i ? 600 : 400,
            }}>
              {t}
            </span>
          ))}
        </div>

        <div style={{ fontSize: '0.7rem', color: '#7A8B7C', marginBottom: '0.4rem', fontWeight: 600 }}>Log Probabilities</div>
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'end', height: '70px', marginBottom: '0.3rem' }}>
          {sent.logProbs.map((lp, i) => {
            const h = (Math.abs(lp) / maxAbsLP) * 60;
            return (
              <div key={i} onMouseEnter={() => setHoveredToken(i)} onMouseLeave={() => setHoveredToken(null)}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '0.58rem', color: hoveredToken === i ? '#2C3E2D' : '#999', fontFamily: "'JetBrains Mono', monospace", marginBottom: '2px', fontWeight: hoveredToken === i ? 600 : 400 }}>
                  {lp.toFixed(1)}
                </div>
                <div style={{
                  width: '100%', maxWidth: '36px', height: `${h}px`,
                  background: getTokenColor(lp), borderRadius: '3px 3px 0 0',
                  opacity: hoveredToken === null || hoveredToken === i ? 1 : 0.35,
                  transition: 'all 0.15s ease',
                }} />
                <div style={{ fontSize: '0.55rem', color: hoveredToken === i ? '#2C3E2D' : '#999', marginTop: '2px' }}>{sent.tokens[i]}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Avg Log Prob</div>
          <div style={{ fontSize: '1.1rem', fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D', fontWeight: 600 }}>
            {avgNegLogProb.toFixed(2)}
          </div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Perplexity</div>
          <div style={{ fontSize: '1.1rem', fontFamily: "'JetBrains Mono', monospace", color: perplexity < 15 ? '#8BA888' : perplexity < 50 ? '#D4A843' : '#C76B4A', fontWeight: 700 }}>
            {perplexity.toFixed(1)}
          </div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Interpretation</div>
          <div style={{ fontSize: '0.78rem', color: '#2C3E2D', fontWeight: 500, marginTop: '0.15rem' }}>
            {perplexity < 15 ? 'Very predictable' : perplexity < 50 ? 'Moderately surprising' : 'Highly surprising'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(139,168,136,0.08)', borderRadius: '6px', border: '1px solid rgba(139,168,136,0.2)' }}>
        <div style={{ fontSize: '0.7rem', color: '#5A6B5C', lineHeight: 1.5 }}>
          <strong style={{ color: '#2C3E2D' }}>Formula:</strong> PPL = exp(-1/N * {'\u03A3'} log P(t_i | t_{'<'}i))
          {' \u2014 '}the geometric mean of inverse token probabilities.
        </div>
      </div>
    </div>
  );
}
