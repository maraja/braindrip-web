import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACFileAndSystemOperations() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Picture a knowledge worker at a desk piled with documents. They can open a folder and read a report, scribble edits on a draft, organize files into labeled folders, search through stacks of papers for a specific clause, and run processes on their computer.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Reading tools let the agent inspect file contents. Implementations range from simple (read entire file) to sophisticated:  Full file read: Returns the complete content of a file. Suitable for files under a few hundred lines.' },
    { emoji: '🔍', label: 'In Detail', text: 'This category of tools is foundational to coding agents (like Claude Code, Cursor, GitHub Copilot Workspace, and Devin), which spend most of their time reading codebases, writing code, running tests, and managing build processes.' },
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
