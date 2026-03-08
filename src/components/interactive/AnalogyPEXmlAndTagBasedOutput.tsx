import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEXmlAndTagBasedOutput() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of how HTML gives structure to web pages. A &lt;h1&gt; tag tells the browser "this is a heading," a &lt;p&gt; tag marks a paragraph, and &lt;img&gt; embeds an image. The content itself flows naturally between the tags, but the tags provide machine-readable structure.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Effective tag-based output starts with meaningful tag names. Use descriptive, self-documenting names: &lt;reasoning&gt; instead of &lt;r&gt;, &lt;final_answer&gt; instead of &lt;a&gt;. Keep nesting shallow — typically 2-3 levels maximum.' },
    { emoji: '🔍', label: 'In Detail', text: 'Unlike JSON, which forces all content into key-value pairs and requires escaping special characters, XML gracefully handles mixed content — a &lt;response&gt; tag can contain paragraphs of natural language, nested &lt;citation&gt; tags, and even embedded code without escaping issues.' },
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
