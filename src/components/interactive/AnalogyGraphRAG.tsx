import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyGraphRAG() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🕸️', label: 'Mind Map', text: 'Standard RAG searches for individual documents. GraphRAG builds a mind map of your entire knowledge base — extracting entities (people, places, concepts), relationships between them, and community structures. When you ask a question, it traverses this graph to find connected information that no single document contains. It excels at "big picture" questions that require synthesizing across many sources.' },
    { emoji: '🗺️', label: 'City Map vs Address Book', text: 'An address book (vector search) finds individual addresses. A city map (knowledge graph) shows how neighborhoods connect, where roads lead, and how areas relate. GraphRAG builds this map: extracting entities and relationships from documents, clustering them into communities, and creating hierarchical summaries. For questions like "What are the main themes in this dataset?" it provides structured, comprehensive answers.' },
    { emoji: '🧬', label: 'Protein Network', text: 'Biologists don\'t study proteins in isolation — they map interaction networks to understand how the whole system works. GraphRAG creates a similar network from your documents: entities are nodes, relationships are edges, and community detection reveals clusters of related information. Queries can traverse multiple hops of the graph, finding indirect connections that semantic similarity search alone would miss.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
