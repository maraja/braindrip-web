import { useState } from 'react';

const DETAILS = [
    { label: 'Optimal tool count range', detail: '5-20 tools for most agent systems. Claude Code uses approximately 10-15 core tools. Cursor uses a similar range. Going beyond 20 should be accompanied by categorization or dynamic loading.' },
    { label: 'Description token budget', detail: 'Each tool description consumes 100-500 tokens in the system prompt. 15 tools at 300 tokens each = 4,500 tokens of system prompt dedicated to tool definitions. This is a meaningful fraction of the context budget.' },
    { label: 'Parameter validation', detail: 'Runtime parameter validation (type checking, range checking, path validation) catches 30-50% of LLM parameter errors before execution, converting potential silent failures into informative error messages.' },
    { label: 'Tool call parsing reliability', detail: 'Modern LLMs (Claude 3.5+, GPT-4o) produce syntactically valid tool calls (correct JSON structure) 99%+ of the time. Semantic validity (correct tool choice, correct parameters) is lower at 85-95%.' },
    { label: 'Parallel tool calls', detail: 'Allowing the LLM to request multiple tool calls in a single turn reduces total loop iterations. Claude and GPT-4 both support parallel tool calls. A common pattern is reading 3-5 files in parallel during the investigation phase.' },
    { label: 'Tool versioning', detail: 'Changing tool descriptions or schemas between sessions can cause inconsistent agent behavior. Production systems should version tool definitions and test for regression when updating.' },
];

export default function ExplorerAACActionSpaceDesign() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Action Space Design — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of action space design.
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
