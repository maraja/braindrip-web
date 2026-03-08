import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPECodeReviewAndDebuggingPrompts() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of the distinction like a proofreader versus a writer. A writer creates new text from a blank page; a proofreader examines existing text for errors, inconsistencies, and improvements. The skills are related but distinct — a great writer can be a poor proofreader and vice versa.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Effective bug identification requires three pieces of context: the code, the error (or unexpected behavior), and the expected behavior. The diagnostic triad: Code: The relevant code, including imports, surrounding context, and any configuration Error: The exact error message, stack trace, or description of unexpected behavior ("returns 0 instead.' },
    { emoji: '🔍', label: 'In Detail', text: 'Code review and debugging prompts provide the model with existing code and ask it to find problems, suggest improvements, or diagnose specific errors. This is an analytical task where the model must read carefully, understand the code\'s intent, and identify discrepancies between intent and implementation.' },
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
