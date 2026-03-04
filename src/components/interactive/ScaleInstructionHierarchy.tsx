import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function ScaleInstructionHierarchy() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>⚡ REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>Instruction hierarchy teaches LLMs to prioritize system prompts over user messages, and user messages over tool outputs. Why is this critical for security?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact →
        </button>
      ) : (
        <div style={{ padding: '0.75rem 1rem', background: '#C76B4A' + '0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
          <p style={{ fontSize: '0.9rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>OpenAI's instruction hierarchy training reduced indirect prompt injection success from 40–60% to under 10% by teaching models to recognize and reject instructions that conflict with higher-privilege messages. This is a fundamental defense layer — without it, any document or webpage an LLM reads could hijack the entire conversation.</p>
        </div>
      )}
    </div>
  );
}
