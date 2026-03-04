import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const examples = [
  {
    name: 'Summarization',
    original: 'You are a helpful assistant. Please read the following article about renewable energy trends in 2024 and provide a concise summary highlighting the key developments, market growth statistics, and policy changes mentioned.',
    compressed: 'helpful assistant. read article renewable energy trends 2024, provide concise summary key developments, market growth statistics, policy changes.',
    originalTokens: 42,
    compressedTokens: 21,
    originalOutput: 'Renewable energy saw 25% growth in 2024, driven by solar installations doubling and new EU carbon reduction policies targeting 55% by 2030.',
    compressedOutput: 'Renewable energy grew 25% in 2024, led by solar doubling and EU policies targeting 55% carbon reduction by 2030.',
    qualityScore: 96,
  },
  {
    name: 'Code Generation',
    original: 'You are an expert Python programmer. Please write a function that takes a list of integers as input and returns the list sorted in ascending order using the merge sort algorithm. Include type hints and docstring.',
    compressed: 'expert Python programmer. write function, list integers input, returns sorted ascending merge sort. Include type hints docstring.',
    originalTokens: 44,
    compressedTokens: 19,
    originalOutput: 'def merge_sort(arr: list[int]) -> list[int]:\n    """Sort list using merge sort."""\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    ...',
    compressedOutput: 'def merge_sort(arr: list[int]) -> list[int]:\n    """Merge sort implementation."""\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    ...',
    qualityScore: 98,
  },
  {
    name: 'Q&A',
    original: 'Based on the provided context about machine learning fundamentals, please answer the following question thoroughly and accurately: What is the difference between supervised and unsupervised learning? Provide examples of each.',
    compressed: 'context machine learning fundamentals, answer: difference supervised unsupervised learning? examples each.',
    originalTokens: 38,
    compressedTokens: 13,
    originalOutput: 'Supervised learning uses labeled data (e.g., image classification, spam detection). Unsupervised learning finds patterns in unlabeled data (e.g., clustering, dimensionality reduction).',
    compressedOutput: 'Supervised learning trains on labeled data (classification, spam detection). Unsupervised finds patterns without labels (clustering, dimensionality reduction).',
    qualityScore: 94,
  },
];

export default function PromptCompressionQuality() {
  const [exIdx, setExIdx] = useState(0);
  const [view, setView] = useState<'prompt' | 'output'>('prompt');

  const ex = examples[exIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Compression Quality Comparison
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Compare original vs compressed prompts and their outputs across tasks.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        {examples.map((e, i) => (
          <button key={e.name} onClick={() => setExIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px',
            border: `1px solid ${exIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: exIdx === i ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
            color: exIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: exIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>
            {e.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {(['prompt', 'output'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: '0.3rem 0.65rem', borderRadius: '6px',
            border: `1px solid ${view === v ? '#8BA888' : '#E5DFD3'}`,
            background: view === v ? 'rgba(139, 168, 136, 0.08)' : 'transparent',
            color: view === v ? '#8BA888' : '#5A6B5C',
            fontWeight: view === v ? 600 : 400, fontSize: '0.75rem', cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {v === 'prompt' ? 'Prompts' : 'Model Outputs'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.68rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Original ({view === 'prompt' ? `${ex.originalTokens} tokens` : 'response'})
          </div>
          <div style={{ fontSize: '0.76rem', color: '#2C3E2D', lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'pre-wrap' }}>
            {view === 'prompt' ? ex.original : ex.originalOutput}
          </div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem', border: '1px solid rgba(139, 168, 136, 0.3)' }}>
          <div style={{ fontSize: '0.68rem', color: '#8BA888', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Compressed ({view === 'prompt' ? `${ex.compressedTokens} tokens` : 'response'})
          </div>
          <div style={{ fontSize: '0.76rem', color: '#2C3E2D', lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'pre-wrap' }}>
            {view === 'prompt' ? ex.compressed : ex.compressedOutput}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Token Reduction</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.15rem', fontWeight: 700, color: '#C76B4A' }}>
            {Math.round((1 - ex.compressedTokens / ex.originalTokens) * 100)}%
          </div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Quality Retained</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.15rem', fontWeight: 700, color: '#8BA888' }}>
            {ex.qualityScore}%
          </div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Latency Saved</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.15rem', fontWeight: 700, color: '#D4A843' }}>
            ~{Math.round((1 - ex.compressedTokens / ex.originalTokens) * 40)}%
          </div>
        </div>
      </div>
    </div>
  );
}
