import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const OUTPUTS = [
  'The weather will be sunny with highs near 75F.',
  'Python is the best programming language ever created.',
  'The study found a 12% increase in productivity.',
  'This restaurant serves incredibly delicious food that everyone loves.',
  'Water boils at 100 degrees Celsius at sea level.',
];

const INITIAL_RATINGS: number[][] = [
  [5, 4, 5],  // Output 1: high agreement
  [2, 4, 3],  // Output 2: moderate disagreement (subjective)
  [5, 5, 4],  // Output 3: high agreement
  [3, 5, 4],  // Output 4: some disagreement
  [5, 5, 5],  // Output 5: perfect agreement
];

const ANNOTATORS = ['Alice', 'Bob', 'Carol'];

export default function AnnotatorAgreementDemo() {
  const [ratings, setRatings] = useState<number[][]>(INITIAL_RATINGS.map(r => [...r]));
  const [selectedOutput, setSelectedOutput] = useState<number | null>(null);

  const updateRating = (outIdx: number, annIdx: number, val: number) => {
    const next = ratings.map(r => [...r]);
    next[outIdx][annIdx] = val;
    setRatings(next);
  };

  // Compute observed agreement (proportion of pairs that agree)
  const computeAgreement = () => {
    let totalPairs = 0;
    let agreePairs = 0;
    for (const row of ratings) {
      for (let i = 0; i < row.length; i++) {
        for (let j = i + 1; j < row.length; j++) {
          totalPairs++;
          if (row[i] === row[j]) agreePairs++;
        }
      }
    }
    return totalPairs > 0 ? agreePairs / totalPairs : 0;
  };

  // Simplified Cohen's kappa (pairwise average)
  const computeKappa = () => {
    const po = computeAgreement();
    // Expected agreement by chance (uniform over 1-5)
    const counts: Record<number, number> = {};
    for (const row of ratings) {
      for (const r of row) {
        counts[r] = (counts[r] || 0) + 1;
      }
    }
    const total = ratings.length * 3;
    let pe = 0;
    for (let v = 1; v <= 5; v++) {
      const p = (counts[v] || 0) / total;
      pe += p * p;
    }
    return pe < 1 ? (po - pe) / (1 - pe) : 1;
  };

  // Simplified Krippendorff's alpha
  const computeAlpha = () => {
    const allRatings = ratings.flat();
    const n = allRatings.length;
    const mean = allRatings.reduce((a, b) => a + b, 0) / n;

    let Do = 0, De = 0;
    for (const row of ratings) {
      for (let i = 0; i < row.length; i++) {
        for (let j = i + 1; j < row.length; j++) {
          Do += (row[i] - row[j]) ** 2;
        }
      }
    }
    Do /= (ratings.length * 3);

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        De += (allRatings[i] - allRatings[j]) ** 2;
      }
    }
    De /= (n * (n - 1) / 2);

    return De > 0 ? 1 - Do / De : 1;
  };

  const kappa = computeKappa();
  const alpha = computeAlpha();

  const getAgreementLevel = (v: number) => {
    if (v >= 0.8) return { label: 'Almost perfect', color: '#8BA888' };
    if (v >= 0.6) return { label: 'Substantial', color: '#6E8B6B' };
    if (v >= 0.4) return { label: 'Moderate', color: '#D4A843' };
    if (v >= 0.2) return { label: 'Fair', color: '#C76B4A' };
    return { label: 'Slight', color: '#C76B4A' };
  };

  const kappaLevel = getAgreementLevel(kappa);
  const alphaLevel = getAgreementLevel(alpha);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Inter-Annotator Agreement
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Three annotators rate five outputs on a 1-5 scale. Adjust ratings to see how agreement metrics change.
        </p>
      </div>

      <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.4rem', color: '#7A8B7C', fontWeight: 600, fontSize: '0.65rem', borderBottom: '1px solid #E5DFD3', width: '45%' }}>Output</th>
              {ANNOTATORS.map(a => (
                <th key={a} style={{ textAlign: 'center', padding: '0.4rem', color: '#7A8B7C', fontWeight: 600, fontSize: '0.65rem', borderBottom: '1px solid #E5DFD3' }}>{a}</th>
              ))}
              <th style={{ textAlign: 'center', padding: '0.4rem', color: '#7A8B7C', fontWeight: 600, fontSize: '0.65rem', borderBottom: '1px solid #E5DFD3' }}>Spread</th>
            </tr>
          </thead>
          <tbody>
            {OUTPUTS.map((out, oi) => {
              const spread = Math.max(...ratings[oi]) - Math.min(...ratings[oi]);
              const hasDisagreement = spread >= 2;
              return (
                <tr key={oi} onClick={() => setSelectedOutput(selectedOutput === oi ? null : oi)}
                  style={{ cursor: 'pointer', background: selectedOutput === oi ? 'rgba(199,107,74,0.05)' : hasDisagreement ? 'rgba(199,107,74,0.03)' : 'transparent' }}>
                  <td style={{ padding: '0.5rem 0.4rem', color: '#2C3E2D', fontSize: '0.75rem', borderBottom: '1px solid #F0EBE1', lineHeight: 1.4 }}>
                    {out}
                  </td>
                  {ANNOTATORS.map((_, ai) => (
                    <td key={ai} style={{ padding: '0.4rem', textAlign: 'center', borderBottom: '1px solid #F0EBE1' }}>
                      <select value={ratings[oi][ai]} onChange={e => updateRating(oi, ai, Number(e.target.value))} onClick={e => e.stopPropagation()}
                        style={{ width: '40px', padding: '0.15rem', borderRadius: '4px', border: '1px solid #E5DFD3', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', background: '#FDFBF7', cursor: 'pointer' }}>
                        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </td>
                  ))}
                  <td style={{ padding: '0.4rem', textAlign: 'center', borderBottom: '1px solid #F0EBE1' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', padding: '0.15rem 0.35rem', borderRadius: '4px', background: hasDisagreement ? 'rgba(199,107,74,0.12)' : 'rgba(139,168,136,0.12)', color: hasDisagreement ? '#C76B4A' : '#8BA888', fontWeight: 600 }}>
                      {spread}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedOutput !== null && (
        <div style={{ background: 'rgba(199,107,74,0.06)', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', border: '1px solid rgba(199,107,74,0.15)' }}>
          <div style={{ fontSize: '0.72rem', color: '#C76B4A', fontWeight: 600, marginBottom: '0.3rem' }}>Why the disagreement?</div>
          <div style={{ fontSize: '0.72rem', color: '#5A6B5C', lineHeight: 1.5 }}>
            {selectedOutput === 1 ? 'Subjective claims ("best language") are inherently harder to rate consistently. Annotators bring personal biases.' :
             selectedOutput === 3 ? 'Emotional language ("incredibly delicious", "everyone loves") splits annotators on quality vs. objectivity.' :
             Math.max(...ratings[selectedOutput]) - Math.min(...ratings[selectedOutput]) >= 2 ?
             'This output has significant rating spread, suggesting ambiguity in the evaluation criteria or genuine quality disagreement.' :
             'Annotators largely agree here. Clear, factual content tends to produce higher agreement.'}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Cohen's Kappa (avg pairwise)</div>
          <div style={{ fontSize: '1.2rem', fontFamily: "'JetBrains Mono', monospace", color: kappaLevel.color, fontWeight: 700 }}>
            {kappa.toFixed(3)}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#5A6B5C' }}>{kappaLevel.label} agreement</div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Krippendorff's Alpha</div>
          <div style={{ fontSize: '1.2rem', fontFamily: "'JetBrains Mono', monospace", color: alphaLevel.color, fontWeight: 700 }}>
            {alpha.toFixed(3)}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#5A6B5C' }}>{alphaLevel.label} agreement</div>
        </div>
      </div>
    </div>
  );
}
