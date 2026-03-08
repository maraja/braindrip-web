import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAECodeExecutionBasedEvaluation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a driving test. Instead of asking a candidate to describe how they would navigate a roundabout, you put them in a car and have them actually drive through one. The proof is in the execution, not the explanation. If they make it through safely and correctly, they pass -- regardless of whether their approach matches the textbook description.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The evaluation loop is straightforward:  Present the coding task to the agent Collect the agent\'s code output Execute the code in a sandboxed environment Run the test suite against the executed code Record pass/fail results for each test case Compute aggregate metrics (pass rate, pass@k)  The test suite serves as the oracle -- the authoritative.' },
    { emoji: '🔍', label: 'In Detail', text: 'Code execution-based evaluation applies this principle to coding agents. Rather than having an LLM judge read generated code and estimate its quality, you run the code against a test suite and observe whether it produces correct results. The test suite acts as an oracle: an authoritative source of truth about whether the code works.' },
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
