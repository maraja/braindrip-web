import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const stages = [
  { name: 'Extract', icon: '📄', desc: 'Extract entities and relationships from source documents', detail: 'LLM identifies named entities (people, orgs, concepts) and relationships between them from each text chunk.', output: 'Entities: 47, Relations: 83' },
  { name: 'Build Graph', icon: '🕸️', desc: 'Construct a knowledge graph from extracted data', detail: 'Entities become nodes, relationships become edges. Duplicate entities are merged using embedding similarity.', output: 'Nodes: 38, Edges: 71' },
  { name: 'Community', icon: '🏘️', desc: 'Detect communities using graph algorithms (e.g., Leiden)', detail: 'The Leiden algorithm partitions the graph into clusters of densely connected entities — each representing a theme or topic.', output: 'Communities: 6' },
  { name: 'Summarize', icon: '📝', desc: 'Generate community summaries at each hierarchy level', detail: 'An LLM creates summaries for each community, capturing the key themes and relationships within that cluster.', output: 'Summaries generated at 3 levels' },
  { name: 'Query', icon: '🔍', desc: 'Route query to relevant communities, aggregate answers', detail: 'The query is matched to relevant community summaries. Multiple partial answers are generated and combined into a final response.', output: 'Final answer synthesized from 3 communities' },
];

export default function GraphRAGViz() {
  const [stageIdx, setStageIdx] = useState(0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>GraphRAG Pipeline</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Entity extraction to knowledge graph to community detection to summarization to query.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.15rem', marginBottom: '1rem', alignItems: 'center' }}>
        {stages.map((s, i) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', flex: 1 }}>
            <button onClick={() => setStageIdx(i)} style={{
              flex: 1, padding: '0.4rem 0.2rem', borderRadius: '6px', textAlign: 'center', cursor: 'pointer',
              border: `1px solid ${stageIdx === i ? '#C76B4A' : '#E5DFD3'}`,
              background: stageIdx === i ? 'rgba(199,107,74,0.08)' : '#F0EBE1',
              fontSize: '0.58rem', color: stageIdx === i ? '#C76B4A' : '#7A8B7C', fontWeight: stageIdx === i ? 600 : 400,
            }}>
              <div style={{ fontSize: '0.9rem' }}>{s.icon}</div>
              <div>{s.name}</div>
            </button>
            {i < stages.length - 1 && <span style={{ color: '#D4C5A9', fontSize: '0.6rem' }}>→</span>}
          </div>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.3rem' }}>{stages[stageIdx].desc}</div>
        <div style={{ fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.6, marginBottom: '0.4rem' }}>{stages[stageIdx].detail}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#8BA888', background: 'rgba(139,168,136,0.08)', padding: '0.3rem 0.5rem', borderRadius: '4px', display: 'inline-block' }}>
          {stages[stageIdx].output}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setStageIdx(Math.max(0, stageIdx - 1))} disabled={stageIdx === 0} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: stageIdx === 0 ? '#D4C5A9' : '#5A6B5C', cursor: stageIdx === 0 ? 'default' : 'pointer', fontSize: '0.78rem' }}>← Prev</button>
        <span style={{ fontSize: '0.72rem', color: '#7A8B7C', alignSelf: 'center' }}>{stageIdx + 1}/{stages.length}</span>
        <button onClick={() => setStageIdx(Math.min(stages.length - 1, stageIdx + 1))} disabled={stageIdx >= stages.length - 1} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: stageIdx >= stages.length - 1 ? '#D4C5A9' : '#5A6B5C', cursor: stageIdx >= stages.length - 1 ? 'default' : 'pointer', fontSize: '0.78rem' }}>Next →</button>
      </div>
    </div>
  );
}
