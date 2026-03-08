import { useState } from 'react';

const DETAILS = [
    { label: 'N-gram range', detail: 'Default character n-gram sizes are 3 to 6. Shorter n-grams (2-3) capture common prefixes and suffixes; longer ones (5-6) capture word stems. The total number of unique character n-grams is bounded using a hashing trick with a default bucket size of 2 million.' },
    { label: 'Vocabulary and n-gram count', detail: 'A typical training run with 1 million unique words and 2 million n-gram buckets yields roughly 3 million vectors to learn.' },
    { label: 'Performance on morphological analogy', detail: 'On German, French, and Spanish morphological analogy tasks, FastText outperforms Word2Vec by 10-25% absolute accuracy.' },
    { label: 'Word similarity benchmarks', detail: 'On English word similarity tasks (WS-353, SimLex-999), FastText performs comparably to Word2Vec and GloVe. The advantage appears primarily on morphological and OOV-heavy evaluations.' },
    { label: 'Model size', detail: 'A 300-dimensional FastText model with 2 million n-gram buckets occupies roughly 2-4 GB uncompressed. Quantized models reduce this to 300-500 MB with minimal accuracy loss.' },
    { label: 'Comparison to BPE tokenizers', detail: 'Modern subword tokenization (BPE, as used in 02-text-preprocessing/tokenization-in-nlp.md) addresses OOV at the tokenization level. FastText addresses it at the embedding level. The approaches are complementary.' },
];

export default function ExplorerNLPFasttext() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          FastText \u2014 Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {DETAILS.map((d, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} style={{
            textAlign: 'left' as const, background: open === i ? '#F0EBE1' : '#FDFBF7', border: '1px solid #E5DFD3',
            borderRadius: '10px', padding: '0.875rem 1rem', cursor: 'pointer', width: '100%', transition: 'background 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.95rem', fontWeight: 600, color: '#2C3E2D' }}>
                {d.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#7A8B7C', transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                &#9654;
              </span>
            </div>
            {open === i && (
              <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: '0.5rem 0 0 0' }}>
                {d.detail}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
