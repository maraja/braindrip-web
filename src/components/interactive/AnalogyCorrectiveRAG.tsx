import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyCorrectiveRAG() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '✅', label: 'Quality Control', text: 'A factory inspects products before shipping and sends defective ones back for rework. Corrective RAG (CRAG) inspects retrieved documents before passing them to the generator: a relevance evaluator scores each document, keeps high-quality ones, discards irrelevant ones, and triggers additional web searches if the initial retrieval was insufficient. Bad retrieval gets "sent back" for correction.' },
    { emoji: '🏥', label: 'Second Opinion', text: 'When a doctor is unsure about a diagnosis, they order additional tests. CRAG does the same: if the confidence in retrieved documents is low, it seeks a "second opinion" by querying additional sources (like web search). If retrieval is clearly irrelevant, it falls back to the model\'s parametric knowledge. This adaptive strategy ensures the generator always works with the best available evidence.' },
    { emoji: '🔍', label: 'Fact-Checking Desk', text: 'A newspaper fact-checking desk verifies sources before publication. CRAG adds a fact-checking step to RAG: retrieved documents are scored for relevance (confident/ambiguous/irrelevant), ambiguous results trigger supplementary searches, and a knowledge refinement step strips irrelevant sentences from kept documents. This reduces the garbage-in-garbage-out problem that plagues naive RAG systems.' },
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
