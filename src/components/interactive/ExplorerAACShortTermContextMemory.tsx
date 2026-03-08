import { useState } from 'react';

const DETAILS = [
    { label: 'Effective vs nominal context window', detail: 'A model with a 128K token context window does not use all 128K tokens equally. Performance degrades for information placed in the middle of very long contexts. Effective working memory is typically 20-40K tokens for reliable use' },
    { label: 'Token counting', detail: 'Accurate token counting requires the model\'s actual tokenizer (tiktoken for OpenAI, SentencePiece for many open-source models). Approximate counting (4 characters per token) is unreliable for non-English text, code, and structured data' },
    { label: 'Message role optimization', detail: 'System messages get special attention weight in most models. Placing critical instructions in the system prompt is more effective than placing them in early user messages' },
    { label: 'Context window sizes (as of early 2025)', detail: 'Claude 3.5 Sonnet: 200K tokens. GPT-4 Turbo: 128K tokens. Gemini 1.5 Pro: up to 2M tokens. Llama 3.1: 128K tokens' },
    { label: 'Cost implications', detail: 'Longer context windows cost more per request (input tokens are billed). A 100K token context costs roughly 25x more than a 4K token context. Context management is also cost management' },
    { label: 'Conversation buffer libraries', detail: 'LangChain provides ConversationBufferMemory, ConversationBufferWindowMemory, ConversationSummaryMemory, and ConversationSummaryBufferMemory as standard components' },
];

export default function ExplorerAACShortTermContextMemory() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Short-Term Context Memory \u2014 Key Details Explorer
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
