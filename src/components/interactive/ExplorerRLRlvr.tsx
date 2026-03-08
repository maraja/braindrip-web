import { useState } from 'react';

const DETAILS = [
    { label: 'Binary vs. graded rewards', detail: 'Binary (correct/incorrect) rewards work well with GRPO because group normalization handles the sparse signal. Within a group of 16--64 samples, some will be correct and others incorrect, creating a natural advantage signal.' },
    { label: 'Answer extraction', detail: 'Robust regex-based extraction is critical. Common patterns include "The answer is X", "\\&#123;X&#125;", and structured output formats. Extraction failures should receive reward 0, not a default value.' },
    { label: 'Symbolic equivalence', detail: 'Math verification must handle equivalent expressions: &#123;2&#125;&#123;4&#125; = &#123;1&#125;&#123;2&#125; = 0.5. Libraries like SymPy provide symbolic comparison.' },
    { label: 'Sandbox execution', detail: 'Code execution must be sandboxed with time limits (typically 10--30 seconds per test case), memory limits, and no network access.' },
    { label: 'Reward for format', detail: 'DeepSeek-R1 added a small format reward to encourage structured output (reasoning in tags, answer in specified format), preventing format degeneration during RL.' },
    { label: 'Difficulty curriculum', detail: 'Starting with easier problems and gradually increasing difficulty improves training stability. If early problems are too hard, the reward signal is too sparse for learning.' },
];

export default function ExplorerRLRlvr() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          RLVR \u2014 Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details.
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
