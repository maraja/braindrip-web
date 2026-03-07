import { useState } from 'react';

const DETAILS = [
    { label: 'STS Benchmark results (Spearman correlation)', detail: 'Averaged GloVe ~58%, Averaged BERT ~47% (surprisingly poor), BERT [CLS] ~29%, InferSent ~68%, USE ~74%, SBERT (bert-base) ~85%, SimCSE (unsupervised) ~82%, all-MiniLM-L6-v2 ~82% (6x faster than SBERT-base).' },
    { label: 'Dimensionality', detail: 'Common dimensions are 384 (MiniLM), 512 (USE), 768 (SBERT-base), 1024 (SBERT-large). Matryoshka representation learning allows truncating vectors to smaller dimensions with graceful degradation.' },
    { label: 'Speed vs. accuracy trade-off', detail: 'all-MiniLM-L6-v2 encodes ~14,000 sentences/sec on GPU vs. ~2,000/sec for SBERT-base, with only ~3% lower STS correlation.' },
    { label: 'Maximum sequence length', detail: 'Most sentence embedding models handle up to 256-512 tokens. Longer inputs are truncated, making them unsuitable for full documents (see `document-embeddings.md`).' },
    { label: 'Normalization', detail: 'Sentence embedding vectors are typically L2-normalized so that cosine similarity reduces to a dot product, enabling efficient approximate nearest neighbor search.' },
];

export default function ExplorerNLPSentenceEmbeddings() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Sentence Embeddings — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of sentence embeddings.
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
