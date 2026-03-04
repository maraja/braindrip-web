import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyCompoundAI() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏭', label: 'Assembly Line', text: 'A single worker making a car from scratch is limited. A factory assembly line — with specialized stations for chassis, engine, paint, and quality control — produces better cars faster. Compound AI systems combine multiple components: retrievers, LLMs, code executors, validators, and routers into a coordinated pipeline. Each component does what it\'s best at, and the whole is greater than the sum of its parts.' },
    { emoji: '🍳', label: 'Professional Kitchen', text: 'A great restaurant doesn\'t have one cook doing everything — it has a team: sous chef (preprocessor), line cooks (specialized models), pastry chef (code generator), expeditor (output validator), and head chef (orchestrator). Compound AI systems similarly compose specialized components into a pipeline: RAG retriever + LLM generator + fact checker + output formatter, each optimized for its role.' },
    { emoji: '🔧', label: 'Toolchain', text: 'Software developers don\'t use one monolithic tool — they use a toolchain: editor, compiler, linter, debugger, profiler. Compound AI systems are the AI equivalent: composing retrieval, generation, verification, and execution components into a system that outperforms any single model. The shift from "bigger model" to "better system" represents the maturation of AI engineering as a discipline.' },
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
