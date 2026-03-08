import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACErrorHandlingAndRetries() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a postal service delivering a package. If the recipient is not home, the carrier does not throw the package away -- they leave a notice and try again tomorrow. If the address does not exist, retrying is pointless -- they return to sender. If there is a blizzard, they stop all deliveries until conditions improve.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The first step in handling an error is classifying it. The primary taxonomy: Transient errors are temporary and likely to resolve on retry. HTTP 429 (rate limit), 503 (service unavailable), network timeouts, and connection resets are transient.' },
    { emoji: '🔍', label: 'In Detail', text: 'Agents are unusually error-prone because they chain multiple unreliable components. An LLM might hallucinate a malformed tool call. A web API might return a 429 rate limit error. A web scraping step might encounter an unexpected page layout. A file system operation might hit a permission error.' },
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
