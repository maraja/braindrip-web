import { useState } from 'react';

const DETAILS = [
    { label: 'DSPy optimizers', detail: 'explore prompt variations (instructions, few-shot examples, chain-of-thought structure) using techniques like random search, Bayesian optimization, and bootstrap sampling from the model\'s own outputs' },
    { label: 'Memory-based improvement', detail: 'requires a retrieval system that matches current tasks to stored corrections and preferences. Embedding-based similarity search with a threshold (cosine > 0.85) prevents irrelevant memories from being injected' },
    { label: 'Skill libraries', detail: 'in Voyager store functions as (name, description, code) triples, retrieved via description similarity when the agent encounters a new task. The library grows from 0 to 300+ skills over extended play sessions' },
    { label: 'Validation loops', detail: 'prevent incorrect self-improvement: a correction from a user might be wrong, a bootstrapped prompt optimization might overfit. Validation on held-out examples catches degradation before it reaches production' },
    { label: 'Improvement velocity', detail: 'varies by mechanism: memory-based improvement shows immediate effect on the next interaction; prompt optimization requires 50-500 training examples to show significant gains; skill acquisition requires repeated encounters with similar challenges' },
    { label: 'Catastrophic forgetting', detail: 'risk: when prompt optimization improves performance on one task type, it may degrade performance on others. Multi-task evaluation during optimization mitigates this' },
];

export default function ExplorerAACSelfImprovingAgents() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Self-Improving Agents — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of self-improving agents.
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
