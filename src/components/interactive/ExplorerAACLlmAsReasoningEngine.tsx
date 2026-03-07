import { useState } from 'react';

const DETAILS = [
    { label: 'Context window sizes (2024-2025)', detail: 'Claude 3.5/4 supports 200K tokens. GPT-4o supports 128K tokens. Gemini 1.5 Pro supports 1M tokens. Effective usable context (before reasoning quality degrades) is typically 60-80% of the maximum.' },
    { label: 'Tokens per reasoning step', detail: 'An LLM typically generates 100-500 tokens of reasoning (chain-of-thought) and 50-200 tokens of tool call per agent loop iteration.' },
    { label: 'Tool call accuracy', detail: 'On well-described tools, Claude 3.5 Sonnet achieves 85-95% correct tool selection and parameter filling on first attempt. Accuracy drops to 70-80% with more than 20 tools or when tool descriptions are ambiguous.' },
    { label: 'Inference latency', detail: 'Time-to-first-token is 200-800ms for most API providers. Full response generation for a typical agent turn (300 tokens) takes 1-3 seconds. Extended thinking modes (Claude) can take 5-30 seconds but produce better plans.' },
    { label: 'Hallucination rate in agent contexts', detail: 'LLMs fabricate file paths, function names, or tool parameters in approximately 5-10% of turns on complex tasks. Verification through tool use (reading the actual file, checking actual output) catches nearly all of these.' },
    { label: 'Model routing', detail: 'Some agent systems use cheaper, faster models (Claude 3.5 Haiku, GPT-4o-mini) for simple decisions (file reading, search queries) and more capable models (Claude 3.5 Sonnet, GPT-4o) for complex reasoning (planning, debugging, code generation). This can reduce costs by 40-60%.' },
];

export default function ExplorerAACLlmAsReasoningEngine() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          LLM as Reasoning Engine — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of llm as reasoning engine.
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
