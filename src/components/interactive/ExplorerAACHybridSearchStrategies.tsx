import { useState } from 'react';

const DETAILS = [
    { label: 'BM25 parameters', detail: 'The standard BM25 formula uses `k1` (term frequency saturation, typically 1.2) and `b` (document length normalization, typically 0.75). These rarely need tuning for hybrid systems since RRF fusion is robust to individual ranker calibration.' },
    { label: 'RRF constant `k`', detail: 'The constant `k` in the RRF formula `1/(k+rank)` controls how much rank position matters. Higher `k` values flatten the score differences between ranks. The standard value of 60 works well across most datasets.' },
    { label: 'Query routing vs parallel execution', detail: 'Some systems route queries to the best strategy (using a query classifier), while others run all strategies in parallel and fuse. Parallel execution is simpler and more robust; routing is faster but risks misclassification. Many production systems use parallel execution with fast strategies (BM25) and selectively add slower strategies (cross-encoder reranking) only when initial results are poor.' },
    { label: 'Embedding model selection', detail: 'The embedding model significantly impacts semantic search quality. Models fine-tuned for retrieval (not just similarity) on domain-relevant data outperform general-purpose embeddings. Matryoshka embeddings allow trading off dimension size for speed.' },
    { label: 'Cross-encoder reranking', detail: 'After initial retrieval from multiple strategies, a cross-encoder reranker (e.g., Cohere Rerank, BGE-reranker) jointly encodes query-document pairs and produces a fine-grained relevance score. This is more accurate than bi-encoder similarity but too slow for first-stage retrieval.' },
    { label: 'Index synchronization', detail: 'Hybrid systems must keep multiple indexes (vector index, inverted index, database tables) synchronized. Document additions, deletions, and updates must propagate to all indexes atomically or with minimal lag.' },
];

export default function ExplorerAACHybridSearchStrategies() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Hybrid Search Strategies — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of hybrid search strategies.
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
