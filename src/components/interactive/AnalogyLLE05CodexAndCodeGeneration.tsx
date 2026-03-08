import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE05CodexAndCodeGeneration() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you hired a junior developer who had read every public repository on GitHub — every function, every comment, every Stack Overflow answer linked in the code. They cannot reason about algorithms from first principles, but they have seen so many patterns that they can autocomplete nearly anything you start typing.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Codex started from a pre-trained GPT-3 checkpoint (specifically the GPT-3 12B variant for the main results) and underwent continued pre-training on code. The training corpus consisted of 159 GB of unique Python files collected from 54 million public GitHub repositories.' },
    { emoji: '🔍', label: 'In Detail', text: 'Published in August 2021 by Mark Chen and colleagues at OpenAI, Codex was a descendant of GPT-3 fine-tuned specifically on code. The base GPT-3 model already showed some ability to generate code — after all, its training data included web pages with code snippets. But its performance was poor: only about 0.' },
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
