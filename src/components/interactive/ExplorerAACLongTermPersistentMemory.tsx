import { useState } from 'react';

const DETAILS = [
    { label: 'Embedding model dimensions', detail: 'text-embedding-3-small: 1536d, text-embedding-3-large: 3072d, E5-large: 1024d. Higher dimensions improve retrieval accuracy at the cost of storage and compute' },
    { label: 'Vector database scaling', detail: 'FAISS handles millions of vectors on a single machine. Pinecone and Weaviate scale to billions with distributed architectures. For most agent use cases, thousands to millions of memories are sufficient' },
    { label: 'Retrieval latency', detail: 'In-memory vector search (FAISS): 1-10ms. Managed vector databases: 10-100ms. Acceptable for interactive use when retrieving 3-5 memories per agent step' },
    { label: 'Memory chunk size', detail: 'Individual memory items should be 100-500 tokens. Too short (single sentences) loses context; too long (full documents) reduces retrieval precision' },
    { label: 'Metadata filtering', detail: 'Combining vector similarity with metadata filters (e.g., "find memories about Python from the last 30 days") dramatically improves retrieval relevance' },
    { label: 'Storage costs', detail: 'Vector databases charge per vector stored and per query. At typical scales (10K-100K memories), costs are $5-50/month. Well within budget for most applications' },
];

export default function ExplorerAACLongTermPersistentMemory() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Long-Term Persistent Memory \u2014 Key Details Explorer
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
