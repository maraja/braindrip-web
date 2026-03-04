import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogySelfRAG() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🤔', label: 'Self-Aware Writer', text: 'Most writers just write. A self-aware writer pauses to think: "Do I need to look something up? Is what I just wrote supported by my sources? Is this relevant?" Self-RAG trains the model to generate special "reflection tokens" that decide: (1) whether retrieval is needed, (2) whether retrieved docs are relevant, (3) whether the generation is supported by evidence, and (4) whether the output is useful.' },
    { emoji: '🚦', label: 'Smart Traffic Lights', text: 'Static traffic lights cycle on a timer regardless of traffic. Smart traffic lights adapt to actual conditions. Self-RAG is the smart traffic light of retrieval: instead of always retrieving (wasteful) or never retrieving (unreliable), the model learns to retrieve on demand — only when it determines that external knowledge would improve the response. This selective retrieval is both more efficient and more effective.' },
    { emoji: '📝', label: 'Self-Grading Student', text: 'Imagine a student who writes an answer, then grades their own work using a rubric: "Did I cite sources? Is my claim supported? Is this relevant to the question?" Self-RAG trains special critique tokens into the model itself. These tokens act as inline self-evaluation, allowing the model to generate, assess, and revise in a single integrated process — no separate critic model needed.' },
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
