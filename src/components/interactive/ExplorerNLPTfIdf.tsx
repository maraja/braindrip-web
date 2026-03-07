import { useState } from 'react';

const DETAILS = [
    { label: 'BM25 connection', detail: 'BM25 (Best Matching 25) extends TF-IDF with saturation (diminishing returns for term frequency) and document length normalization. The TF component becomes `(f(t,d) * (k1 + 1)) / (f(t,d) + k1 * (1 - b + b * dl/avgdl))`, where k1 = 1.2 and b = 0.75 are standard parameters.' },
    { label: 'Typical vocabulary sizes', detail: 'After pruning with min_df=2 and max_df=0.95, English corpora typically yield 10,000-100,000 features. The 20 Newsgroups dataset produces roughly 130,000 features without pruning, 25,000-35,000 after.' },
    { label: 'Sparsity', detail: 'TF-IDF matrices are even sparser than raw BoW since many weights are driven toward zero by IDF. Sparsity is typically 99.5%+ for large vocabularies.' },
    { label: 'Cosine similarity', detail: 'The standard similarity metric for TF-IDF vectors. Two documents with cosine similarity > 0.3 are generally considered related; > 0.7 is highly similar.' },
    { label: 'Performance ceiling', detail: 'On the 20 Newsgroups classification benchmark, TF-IDF + linear SVM achieves roughly 82-85% accuracy, compared to 85-88% for fine-tuned BERT.' },
];

export default function ExplorerNLPTfIdf() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          TF-IDF — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of tf-idf.
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
