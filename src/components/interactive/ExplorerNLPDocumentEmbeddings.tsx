import { useState } from 'react';

const DETAILS = [
    { label: 'LSA dimensions', detail: 'Typical choices are 100-500 components. On the 20 Newsgroups dataset, 300 SVD components retain roughly 35% of variance but improve classification accuracy by 1-3% over raw TF-IDF due to noise reduction.' },
    { label: 'Doc2Vec training', detail: 'Requires 10-20 epochs over the corpus. The gensim library provides a standard implementation. PV-DBOW with 300 dimensions is the most common configuration.' },
    { label: 'Long document handling', detail: 'Standard BERT handles 512 tokens (roughly 400 words). Strategies for longer documents include truncation (fast but lossy), chunking + pooling (encode chunks separately, then average or max-pool), and efficient transformers (Longformer, BigBird).' },
    { label: 'Longformer performance', detail: 'On IMDB classification (long reviews), Longformer achieves 95.7% accuracy vs. RoBERTa\'s 95.3% (with truncation at 512 tokens). The gap widens for longer documents.' },
    { label: 'Retrieval benchmarks', detail: 'On the MS MARCO passage retrieval benchmark, DPR achieves MRR@10 of ~31%, compared to BM25\'s ~19%. ColBERT achieves ~36% through late interaction.' },
    { label: 'Storage requirements', detail: 'A corpus of 1 million documents with 768-dimensional float32 embeddings requires ~3 GB of storage. Quantization to int8 reduces this to ~768 MB.' },
];

export default function ExplorerNLPDocumentEmbeddings() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Document Embeddings — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of document embeddings.
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
