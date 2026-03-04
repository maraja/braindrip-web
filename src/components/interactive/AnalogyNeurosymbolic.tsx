import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyNeurosymbolic() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🧠', label: 'Left Brain + Right Brain', text: 'The right brain handles intuition and pattern recognition (neural networks). The left brain handles logic and structured reasoning (symbolic AI). Neurosymbolic AI combines both: using neural networks for perception and pattern matching, and symbolic systems for logical reasoning, planning, and maintaining hard constraints. You get the flexibility of neural AI with the precision and verifiability of symbolic reasoning.' },
    { emoji: '🧮', label: 'Calculator + Intuition', text: 'A human estimates "roughly 200" (intuition/neural) then uses a calculator for the exact answer (symbolic/logical). Neurosymbolic systems work similarly: the LLM understands natural language and generates approximate plans, then formal tools (code interpreters, logic solvers, knowledge graphs) execute precise computations. The neural system handles ambiguity; the symbolic system ensures correctness.' },
    { emoji: '🏗️', label: 'Architect + Engineer', text: 'An architect envisions creative designs (neural thinking), but a structural engineer ensures they don\'t collapse (formal verification). Neurosymbolic AI pairs neural creativity with symbolic rigor: the LLM generates hypotheses and the symbolic system verifies them against formal rules. This approach excels where both flexibility and guaranteed correctness are needed — like generating code that must pass type-checking.' },
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
