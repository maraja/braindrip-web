import { useState } from 'react';

const DETAILS = [
    { label: 'Source freshness tracking', detail: 'Each chunk stores its source URL, last-checked timestamp, expected update frequency, and content hash. A background process periodically fetches sources and compares hashes to detect changes.' },
    { label: 'Embedding model migration', detail: 'When upgrading to a better embedding model, all existing embeddings become incompatible with new query embeddings. Migration requires re-embedding the entire corpus -- a potentially expensive operation for large knowledge bases.' },
    { label: 'Contradiction resolution strategies', detail: 'When new content contradicts old content on the same topic, the system can (a) always prefer the newer version, (b) flag contradictions for human review, (c) keep both versions with temporal metadata, or (d) apply domain-specific rules (e.g., peer-reviewed sources override blog posts).' },
    { label: 'Chunk-level metadata', detail: 'Every chunk carries metadata including: source document, chunk position, creation date, last verified date, source authority score, and content hash. This metadata enables targeted maintenance operations (e.g., "refresh all chunks from source X").' },
    { label: 'Quality monitoring', detail: 'Track retrieval quality metrics over time: average relevance score of top-k results, percentage of queries with no relevant results, user feedback on answer quality. Degradation in these metrics signals maintenance needs.' },
    { label: 'Automated testing', detail: 'A test suite of known question-answer pairs validates that the knowledge base produces correct retrievals. Run these tests after every maintenance operation (content update, deduplication, re-indexing) to catch regressions.' },
];

export default function ExplorerAACKnowledgeBaseMaintenance() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Knowledge Base Maintenance \u2014 Key Details Explorer
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
