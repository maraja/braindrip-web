import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const METHODS = [
  { name: 'N-gram Overlap', key: 'ngram', desc: 'Check if contiguous sequences of N words from test data appear in training data. GPT-3 used 13-gram overlap for decontamination.' },
  { name: 'Embedding Similarity', key: 'embedding', desc: 'Compute semantic similarity between training and test examples using sentence embeddings. Catches paraphrases that n-gram methods miss.' },
  { name: 'Canary String', key: 'canary', desc: 'Insert unique random strings ("canaries") into benchmark data before release. If the model can reproduce them, the data leaked into training.' },
];

const TEST_PAIRS = [
  {
    train: 'The French Revolution began in 1789 when the Bastille was stormed by angry citizens.',
    test: 'The French Revolution began in 1789 when the Bastille was stormed by angry citizens.',
    ngram: { detected: true, score: 1.0, detail: '13-gram match found: entire sentence is verbatim' },
    embedding: { detected: true, score: 0.99, detail: 'Cosine similarity 0.99 exceeds threshold 0.90' },
    canary: { detected: false, score: 0.0, detail: 'No canary strings found (method only works proactively)' },
    label: 'Exact copy',
  },
  {
    train: 'The French Revolution started in 1789 with the storming of the Bastille by furious civilians.',
    test: 'The French Revolution began in 1789 when the Bastille was stormed by angry citizens.',
    ngram: { detected: false, score: 0.38, detail: 'Longest matching 13-gram not found. Max 5-gram: "French Revolution" + "in 1789"' },
    embedding: { detected: true, score: 0.94, detail: 'Cosine similarity 0.94 exceeds threshold 0.90. Semantic meaning preserved.' },
    canary: { detected: false, score: 0.0, detail: 'No canary strings found' },
    label: 'Paraphrase',
  },
  {
    train: 'CANARY_xK9mP2_STRING The capital of France is Paris, a major European city.',
    test: 'What is the capital of France? [CANARY_xK9mP2_STRING]',
    ngram: { detected: false, score: 0.21, detail: 'Low n-gram overlap. Different sentence structure.' },
    embedding: { detected: false, score: 0.72, detail: 'Below threshold 0.90. Topically related but different content.' },
    canary: { detected: true, score: 1.0, detail: 'Canary string "CANARY_xK9mP2_STRING" found in training data!' },
    label: 'Canary leaked',
  },
  {
    train: 'Photosynthesis converts carbon dioxide and water into glucose using sunlight energy.',
    test: 'The French Revolution began in 1789 when the Bastille was stormed by angry citizens.',
    ngram: { detected: false, score: 0.0, detail: 'No matching n-grams. Completely different topics.' },
    embedding: { detected: false, score: 0.12, detail: 'Cosine similarity 0.12 is well below threshold 0.90.' },
    canary: { detected: false, score: 0.0, detail: 'No canary strings found' },
    label: 'No contamination',
  },
];

export default function DecontaminationMethodsDemo() {
  const [method, setMethod] = useState<string>('ngram');
  const [pairIdx, setPairIdx] = useState(0);

  const pair = TEST_PAIRS[pairIdx];
  const result = pair[method as 'ngram' | 'embedding' | 'canary'];
  const activeMethod = METHODS.find(m => m.key === method)!;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Decontamination Methods Comparison
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Test three decontamination methods on different data pairs. Each method has different strengths and blind spots.
        </p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Detection Method</div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {METHODS.map(m => (
            <button key={m.key} onClick={() => setMethod(m.key)} style={{
              padding: '0.35rem 0.7rem', borderRadius: '6px',
              border: `1px solid ${method === m.key ? '#C76B4A' : '#E5DFD3'}`,
              background: method === m.key ? 'rgba(199,107,74,0.08)' : 'transparent',
              color: method === m.key ? '#C76B4A' : '#5A6B5C',
              fontWeight: method === m.key ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
            }}>
              {m.name}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#5A6B5C', marginTop: '0.4rem', lineHeight: 1.5 }}>{activeMethod.desc}</div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Test Pair</div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {TEST_PAIRS.map((p, i) => (
            <button key={i} onClick={() => setPairIdx(i)} style={{
              padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer',
              border: `1px solid ${pairIdx === i ? '#D4A843' : '#E5DFD3'}`,
              background: pairIdx === i ? 'rgba(212,168,67,0.08)' : 'transparent',
              color: pairIdx === i ? '#D4A843' : '#5A6B5C', fontWeight: pairIdx === i ? 600 : 400,
            }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Training Data Sample</div>
          <div style={{ fontSize: '0.72rem', color: '#2C3E2D', lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }}>
            {pair.train}
          </div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Benchmark Test Data</div>
          <div style={{ fontSize: '0.72rem', color: '#2C3E2D', lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }}>
            {pair.test}
          </div>
        </div>
      </div>

      <div style={{
        background: result.detected ? 'rgba(199,107,74,0.06)' : 'rgba(139,168,136,0.06)',
        borderRadius: '8px', padding: '1rem',
        border: `1px solid ${result.detected ? 'rgba(199,107,74,0.2)' : 'rgba(139,168,136,0.2)'}`,
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: result.detected ? '#C76B4A' : '#8BA888' }}>
              {result.detected ? 'CONTAMINATION DETECTED' : 'NO CONTAMINATION FOUND'}
            </span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', fontWeight: 700, color: result.detected ? '#C76B4A' : '#8BA888' }}>
            {(result.score * 100).toFixed(0)}%
          </span>
        </div>

        <div style={{ height: '10px', background: '#E5DFD3', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
          <div style={{ width: `${result.score * 100}%`, height: '100%', background: result.detected ? '#C76B4A' : '#8BA888', borderRadius: '3px', transition: 'width 0.3s ease' }} />
        </div>

        <div style={{ fontSize: '0.75rem', color: '#5A6B5C', lineHeight: 1.5 }}>{result.detail}</div>
      </div>

      {/* Method comparison matrix */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>All Methods on This Pair</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {METHODS.map(m => {
            const r = pair[m.key as 'ngram' | 'embedding' | 'canary'];
            return (
              <div key={m.key} style={{
                padding: '0.5rem', borderRadius: '6px', textAlign: 'center',
                background: m.key === method ? '#FDFBF7' : 'transparent',
                border: `1px solid ${m.key === method ? '#E5DFD3' : 'transparent'}`,
              }}>
                <div style={{ fontSize: '0.62rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.15rem' }}>{m.name}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: r.detected ? '#C76B4A' : '#8BA888' }}>
                  {r.detected ? 'Found' : 'Clean'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
