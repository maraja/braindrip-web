import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEGuardrailsAndOutputFiltering() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a factory production line. The machines (LLMs) produce outputs at high speed, but before any product ships to a customer, it passes through quality control inspectors who check for defects, verify specifications, and reject anything that does not meet standards.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Content classifiers analyze the model\'s output for unsafe or policy-violating content before delivery. These classifiers may be rule-based (keyword lists, regex patterns), ML-based (fine-tuned classifiers for toxicity, hate speech, or self-harm content), or LLM-based (a secondary model that evaluates the primary model\'s output).' },
    { emoji: '🔍', label: 'In Detail', text: 'Output filtering is a specific subset of guardrails focused on post-generation checks. While input guardrails sanitize what goes into the model (see prompt-injection-defense-techniques.md), output guardrails validate what comes out. The complete architecture forms a pipeline: input guard, then LLM generation, then output guard.' },
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
