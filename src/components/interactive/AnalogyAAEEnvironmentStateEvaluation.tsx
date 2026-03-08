import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEEnvironmentStateEvaluation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine asking someone to rearrange your living room. You do not care whether they moved the couch first or the bookshelf first, whether they temporarily placed items in the hallway, or whether they took five minutes or fifty. You care about the result: Is the couch where you wanted it? Is the bookshelf against the correct wall?' },
    { emoji: '⚙️', label: 'How It Works', text: 'For web agents (agents that navigate and interact with websites):  Page state checks: After the agent completes a task like "fill out the registration form," verify that form fields contain the expected values, the correct page is displayed, and submission confirmations are present Element visibility: Check that expected UI elements are visible.' },
    { emoji: '🔍', label: 'In Detail', text: 'Environment-state evaluation applies this outcome-focused approach to agent assessment. Instead of analyzing the agent\'s action sequence or scoring its textual output, you inspect the environment after the agent finishes. Did the web page end up with the correct form values? Does the file system contain the right files with the right contents?' },
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
