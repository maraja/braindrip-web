import { useState } from 'react';

const DETAILS = [
    { label: 'Top-k selection', detail: 'Retrieve 3-5 memories for injection into context. Below 3 risks missing relevant information; above 5 risks context pollution. For very important tasks, retrieve 10, then rerank to top-5' },
    { label: 'Embedding model choice matters', detail: 'Specialized retrieval models (Cohere embed-v3, Voyage-2) outperform general-purpose models (OpenAI ada-002) on retrieval benchmarks by 5-15% NDCG' },
    { label: 'BM25 + vector hybrid', detail: 'Research consistently shows 5-10% improvement over vector-only retrieval when combining with BM25 keyword search' },
    { label: 'Reranking cost', detail: 'A cross-encoder reranking step costs ~10ms per candidate. Reranking 20 candidates adds ~200ms latency. Worth it for high-stakes retrieval; excessive for routine queries' },
    { label: 'Minimum relevance threshold', detail: 'Set a minimum similarity score (typically 0.3-0.5 cosine similarity) below which memories are not retrieved, even if they are the "most similar." Retrieving low-relevance memories is worse than retrieving nothing' },
    { label: 'Cold start problem', detail: 'When the memory store is empty or small, retrieval returns few or no results. Handle this gracefully: the agent should function without memories and not error when retrieval returns empty' },
];

export default function ExplorerAACMemoryRetrievalStrategies() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Memory Retrieval Strategies \u2014 Key Details Explorer
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
