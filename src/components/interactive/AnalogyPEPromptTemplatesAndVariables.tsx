import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEPromptTemplatesAndVariables() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of form letters with personalized fields. A law firm does not write every client letter from scratch. They have templates: "Dear &#123;client_name&#125;, Regarding your &#123;case_type&#125; case filed on &#123;date&#125;..." The structure, tone, and legal language stay constant. Only the client-specific details change.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Different frameworks use different variable syntaxes, but the concepts are universal:  The key principle: static text (instructions, format specifications) is authored once, and dynamic content (user input, retrieved data) is injected at runtime. This separation enables prompt reuse across requests, systematic testing, and version management.' },
    { emoji: '🔍', label: 'In Detail', text: 'Prompt templates work the same way. A template is a prompt with fixed instruction text and variable slots (typically denoted &#123;variable_name&#125;) that are filled at runtime with specific content — user input, retrieved documents, database values, or outputs from previous processing steps.' },
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
