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
    type: 'Verbatim Match',
    severity: 'critical',
    trainData: 'The mitochondria is the powerhouse of the cell. It produces ATP through oxidative phosphorylation.',
    testData: 'The mitochondria is the powerhouse of the cell. It produces ATP through oxidative phosphorylation.',
    overlap: 100,
    inflatedScore: 98,
    trueScore: 72,
    explanation: 'Exact copy of test data found in training set. The model memorized the answer rather than learning the concept.',
  },
  {
    type: 'Near-Duplicate',
    severity: 'high',
    trainData: 'The mitochondrion is the powerhouse of cells. It produces ATP via oxidative phosphorylation processes.',
    testData: 'The mitochondria is the powerhouse of the cell. It produces ATP through oxidative phosphorylation.',
    overlap: 82,
    inflatedScore: 91,
    trueScore: 72,
    explanation: 'Minor paraphrasing (singular/plural, synonym substitution) but substantially the same content. Hard to detect with exact matching.',
  },
  {
    type: 'Paraphrase',
    severity: 'moderate',
    trainData: 'Cellular energy production centers on the mitochondria, organelles that generate adenosine triphosphate using a process called oxidative phosphorylation.',
    testData: 'The mitochondria is the powerhouse of the cell. It produces ATP through oxidative phosphorylation.',
    overlap: 35,
    inflatedScore: 82,
    trueScore: 72,
    explanation: 'Same information conveyed with different wording and sentence structure. Requires semantic analysis to detect.',
  },
  {
    type: 'No Contamination',
    severity: 'none',
    trainData: 'Photosynthesis converts light energy into chemical energy stored in glucose molecules within chloroplasts.',
    testData: 'The mitochondria is the powerhouse of the cell. It produces ATP through oxidative phosphorylation.',
    overlap: 5,
    inflatedScore: 72,
    trueScore: 72,
    explanation: 'Training and test data cover different topics. No contamination detected.',
  },
];

export default function ContaminationDetectorViz() {
  const [selected, setSelected] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  const ex = EXAMPLES[selected];

  const highlightOverlap = (text: string, reference: string) => {
    const words = text.split(' ');
    const refWords = new Set(reference.toLowerCase().split(' '));
    return words.map((w, i) => {
      const isOverlap = refWords.has(w.toLowerCase().replace(/[.,!?]/g, ''));
      return (
        <span key={i} style={{
          background: isOverlap && ex.type !== 'No Contamination' ? 'rgba(199,107,74,0.2)' : 'transparent',
          borderRadius: '2px', padding: '0 1px',
        }}>
          {w}{' '}
        </span>
      );
    });
  };

  const severityColor: Record<string, string> = { critical: '#C76B4A', high: '#D4A843', moderate: '#8BA888', none: '#7A8B7C' };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Benchmark Contamination Detector
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          See how training data overlaps with benchmark test data, inflating scores beyond true capability.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {EXAMPLES.map((e, i) => (
          <button key={e.type} onClick={() => { setSelected(i); setShowComparison(false); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px',
            border: `1px solid ${selected === i ? severityColor[e.severity] : '#E5DFD3'}`,
            background: selected === i ? severityColor[e.severity] + '12' : 'transparent',
            color: selected === i ? severityColor[e.severity] : '#5A6B5C',
            fontWeight: selected === i ? 600 : 400, fontSize: '0.72rem', cursor: 'pointer',
          }}>
            {e.type}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Training Data</span>
            <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem', borderRadius: '3px', background: 'rgba(139,168,136,0.12)', color: '#5A6B5C', fontFamily: "'JetBrains Mono', monospace" }}>train.jsonl</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#2C3E2D', lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }}>
            {showComparison ? highlightOverlap(ex.trainData, ex.testData) : ex.trainData}
          </div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Test Data (Benchmark)</span>
            <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem', borderRadius: '3px', background: 'rgba(199,107,74,0.12)', color: '#C76B4A', fontFamily: "'JetBrains Mono', monospace" }}>test.jsonl</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#2C3E2D', lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }}>
            {showComparison ? highlightOverlap(ex.testData, ex.trainData) : ex.testData}
          </div>
        </div>
      </div>

      <button onClick={() => setShowComparison(!showComparison)} style={{
        display: 'block', width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #C76B4A',
        background: showComparison ? 'rgba(199,107,74,0.08)' : 'transparent', color: '#C76B4A',
        fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500, marginBottom: '1rem',
      }}>
        {showComparison ? 'Hide' : 'Highlight'} Word Overlap
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.65rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Severity</div>
          <div style={{ fontSize: '0.85rem', color: severityColor[ex.severity], fontWeight: 700, textTransform: 'capitalize' }}>{ex.severity}</div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.65rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Overlap</div>
          <div style={{ fontSize: '1rem', fontFamily: "'JetBrains Mono', monospace", color: ex.overlap > 50 ? '#C76B4A' : '#8BA888', fontWeight: 700 }}>{ex.overlap}%</div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.65rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Inflated Score</div>
          <div style={{ fontSize: '1rem', fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', fontWeight: 700 }}>{ex.inflatedScore}%</div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.65rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>True Score</div>
          <div style={{ fontSize: '1rem', fontFamily: "'JetBrains Mono', monospace", color: '#8BA888', fontWeight: 700 }}>{ex.trueScore}%</div>
        </div>
      </div>

      {ex.inflatedScore !== ex.trueScore && (
        <div style={{ padding: '0.6rem 0.75rem', background: 'rgba(199,107,74,0.06)', borderRadius: '8px', border: '1px solid rgba(199,107,74,0.15)', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.72rem', color: '#C76B4A', fontWeight: 600, marginBottom: '0.15rem' }}>Score Inflation: +{ex.inflatedScore - ex.trueScore} points</div>
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <div style={{ flex: 1, height: '10px', background: '#E5DFD3', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: `${ex.trueScore}%`, height: '100%', background: '#8BA888', borderRadius: '3px' }} />
              <div style={{ position: 'absolute', top: 0, left: `${ex.trueScore}%`, width: `${ex.inflatedScore - ex.trueScore}%`, height: '100%', background: 'rgba(199,107,74,0.4)', borderRadius: '0 3px 3px 0' }} />
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(139,168,136,0.08)', borderRadius: '6px', border: '1px solid rgba(139,168,136,0.2)' }}>
        <div style={{ fontSize: '0.72rem', color: '#5A6B5C', lineHeight: 1.5 }}>{ex.explanation}</div>
      </div>
    </div>
  );
}
