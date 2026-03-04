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
  {
    reference: 'The cat sat on the mat.',
    outputs: [
      { text: 'The cat sat on the mat.', exact: 1.0, bleu: 1.0, rouge: 1.0, bertscore: 0.99, human: 5.0 },
      { text: 'A cat was sitting on the mat.', exact: 0.0, bleu: 0.42, rouge: 0.67, bertscore: 0.94, human: 4.5 },
      { text: 'The feline rested upon the rug.', exact: 0.0, bleu: 0.08, rouge: 0.22, bertscore: 0.88, human: 4.0 },
      { text: 'Dogs play in the yard.', exact: 0.0, bleu: 0.05, rouge: 0.11, bertscore: 0.62, human: 0.5 },
    ],
  },
  {
    reference: 'Machine learning models require large amounts of training data.',
    outputs: [
      { text: 'ML models need lots of training data.', exact: 0.0, bleu: 0.22, rouge: 0.44, bertscore: 0.91, human: 4.5 },
      { text: 'Machine learning models require large amounts of training data.', exact: 1.0, bleu: 1.0, rouge: 1.0, bertscore: 0.99, human: 5.0 },
      { text: 'Deep neural networks demand extensive datasets for effective training.', exact: 0.0, bleu: 0.04, rouge: 0.12, bertscore: 0.85, human: 4.0 },
      { text: 'Training data is important for machine learning.', exact: 0.0, bleu: 0.18, rouge: 0.40, bertscore: 0.87, human: 3.5 },
    ],
  },
];

const METRICS = [
  { key: 'exact' as const, name: 'Exact Match', desc: 'Binary: identical or not' },
  { key: 'bleu' as const, name: 'BLEU', desc: 'N-gram precision overlap' },
  { key: 'rouge' as const, name: 'ROUGE-L', desc: 'Longest common subsequence' },
  { key: 'bertscore' as const, name: 'BERTScore', desc: 'Semantic embedding similarity' },
  { key: 'human' as const, name: 'Human', desc: 'Human quality rating (0-5)' },
];

export default function MetricComparisonViz() {
  const [exIdx, setExIdx] = useState(0);
  const [selOutput, setSelOutput] = useState(1);
  const ex = EXAMPLES[exIdx];
  const out = ex.outputs[selOutput];

  const getColor = (val: number, max: number) => {
    const ratio = val / max;
    if (ratio >= 0.8) return '#8BA888';
    if (ratio >= 0.5) return '#D4A843';
    return '#C76B4A';
  };

  const allScores = METRICS.map(m => ({ ...m, val: out[m.key] }));
  const humanNorm = out.human / 5;
  const disagreements = allScores.filter(m => {
    const norm = m.key === 'human' ? humanNorm : m.val;
    return Math.abs(norm - humanNorm) > 0.25;
  });

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Evaluation Metric Comparison
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          See the same output scored by five different metrics. Notice where they agree and disagree.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {EXAMPLES.map((_, i) => (
          <button key={i} onClick={() => { setExIdx(i); setSelOutput(1); }} style={{
            padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer',
            border: `1px solid ${exIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: exIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent',
            color: exIdx === i ? '#C76B4A' : '#5A6B5C', fontWeight: exIdx === i ? 600 : 400,
          }}>
            Example {i + 1}
          </button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reference</div>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', fontFamily: "'JetBrains Mono', monospace", marginTop: '0.25rem' }}>{ex.reference}</div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Output</div>
        {ex.outputs.map((o, i) => (
          <button key={i} onClick={() => setSelOutput(i)} style={{
            display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', marginBottom: '0.3rem',
            borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem',
            border: `1px solid ${selOutput === i ? '#C76B4A' : '#E5DFD3'}`,
            background: selOutput === i ? 'rgba(199,107,74,0.06)' : '#F0EBE1',
            color: '#2C3E2D', fontFamily: "'JetBrains Mono', monospace",
          }}>
            {o.text}
          </button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem' }}>
        <div style={{ fontSize: '0.7rem', color: '#7A8B7C', marginBottom: '0.6rem', fontWeight: 600 }}>Metric Scores</div>
        {METRICS.map(m => {
          const val = out[m.key];
          const max = m.key === 'human' ? 5 : 1;
          const pct = (val / max) * 100;
          return (
            <div key={m.key} style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#5A6B5C' }}>{m.name} <span style={{ color: '#999', fontSize: '0.62rem' }}>({m.desc})</span></span>
                <span style={{ fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: getColor(pct, 100) }}>
                  {m.key === 'human' ? val.toFixed(1) + '/5' : val.toFixed(2)}
                </span>
              </div>
              <div style={{ height: '10px', background: '#E5DFD3', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: getColor(pct, 100), borderRadius: '3px', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          );
        })}
        {disagreements.length > 0 && (
          <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(199,107,74,0.08)', borderRadius: '6px', border: '1px solid rgba(199,107,74,0.2)' }}>
            <div style={{ fontSize: '0.7rem', color: '#C76B4A', fontWeight: 600, marginBottom: '0.2rem' }}>Metric Disagreement Detected</div>
            <div style={{ fontSize: '0.7rem', color: '#5A6B5C' }}>
              {out.bertscore > 0.85 && out.bleu < 0.15 ? 'BERTScore captures semantic similarity that BLEU misses (paraphrases).' :
               out.exact === 1 ? 'Exact match gives a perfect score but tells us nothing about partial matches.' :
               'These metrics weight different aspects of quality differently.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
