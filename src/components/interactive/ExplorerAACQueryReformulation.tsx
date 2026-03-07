import { useState } from 'react';

const DETAILS = [
    { label: 'HyDE implementation', detail: 'Generate a hypothetical answer using the LLM (zero-shot), encode it with the same embedding model used for the document corpus, and use the resulting vector for similarity search. This typically improves retrieval by 10-20% on diverse query sets.' },
    { label: 'Sub-query generation prompt', detail: 'The decomposition prompt instructs the LLM to identify independent information needs and generate self-contained sub-queries. Each sub-query should be answerable independently.' },
    { label: 'Relevance feedback loop', detail: 'After each retrieval round, the agent scores result relevance (using either an LLM or a cross-encoder reranker). If the top result relevance score falls below a threshold (e.g., 0.7), reformulation is triggered.' },
    { label: 'Maximum reformulation rounds', detail: 'Typically capped at 2-3 rounds to prevent infinite loops. Each round has diminishing returns, and beyond 3 rounds, the issue is usually with the knowledge base, not the query.' },
    { label: 'Fusion strategies', detail: 'When multiple reformulated queries each return results, reciprocal rank fusion (RRF) combines the ranked lists into a single ranking that benefits from the diversity of different query formulations.' },
    { label: 'Query type detection', detail: 'The reformulation strategy depends on query type. Factoid questions benefit from expansion, analytical questions from decomposition, and vague questions from HyDE.' },
];

export default function ExplorerAACQueryReformulation() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Query Reformulation — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of query reformulation.
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
