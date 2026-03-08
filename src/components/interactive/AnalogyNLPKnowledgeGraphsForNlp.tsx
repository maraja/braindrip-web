import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPKnowledgeGraphsForNlp() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a vast web where every node is a thing in the world -- a person, a city, a concept, a protein -- and every edge is a fact connecting two things: "Einstein" --born_in--&gt; "Ulm," "Ulm" --located_in--&gt; "Germany," "Einstein" --won--&gt; "Nobel Prize in Physics.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The Resource Description Framework (RDF) is the W3C standard for representing knowledge graph data. Every fact is a triple (subject, predicate, object):  RDF uses URIs for global uniqueness and supports literals (strings, numbers, dates) as objects.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, a knowledge graph is a directed, labeled multigraph G = (E, R, T), where E is a set of entities, R is a set of relation types, and T is a set of triples (h, r, t) with h, t in E and r in R. Each triple asserts a fact: the head entity h is related to the tail entity t by relation r. Knowledge graphs also store entity attributes (e.g.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u2726 KEY PERSPECTIVES</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' as const }}>
        {perspectives.map((p, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA88818' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{perspectives[idx].text}</p>
    </div>
  );
}
