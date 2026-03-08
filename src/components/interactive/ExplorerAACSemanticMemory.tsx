import { useState } from 'react';

const DETAILS = [
    { label: 'Knowledge graph size', detail: 'Most agent semantic memory stores contain hundreds to thousands of entities and relationships. This is manageable in-memory (NetworkX) for small stores or in a dedicated graph database for larger stores' },
    { label: 'Entity extraction cost', detail: 'Extracting entities and relationships from natural language text costs one LLM call per passage (~200-500 tokens). Automated extraction is 70-85% accurate; critical facts should be user-confirmed' },
    { label: 'Update frequency', detail: 'Semantic memory should be updated immediately when the agent learns new facts (within the session) and reconciled periodically (across sessions) to resolve conflicts and remove stale entries' },
    { label: 'Query patterns', detail: 'Most agent semantic memory queries are simple key lookups ("What database does this project use?") or one-hop traversals ("What tools are related to the user\'s preferred framework?"). Complex multi-hop queries are rare in practice' },
    { label: 'Hybrid retrieval', detail: 'Combining structured queries (exact fact lookup) with vector search (semantic similarity) provides the best coverage. Use structured queries when you know what you are looking for, vector search when exploring' },
    { label: 'Storage overhead', detail: 'A knowledge graph with 10,000 entities and 50,000 relationships requires approximately 10-50MB of storage. Well within the capacity of any database' },
];

export default function ExplorerAACSemanticMemory() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Semantic Memory \u2014 Key Details Explorer
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
