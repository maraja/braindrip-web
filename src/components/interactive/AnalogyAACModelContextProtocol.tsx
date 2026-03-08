import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACModelContextProtocol() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine the USB standard before it existed. Every device — printer, mouse, keyboard, camera — had its own proprietary connector. Buying a new device meant hoping you had the right port. USB solved this by creating a single standard connector that any device could use with any computer.' },
    { emoji: '⚙️', label: 'How It Works', text: 'MCP uses a three-layer architecture:  Host: The AI application the user interacts with (e.g., Claude Desktop, an IDE with AI integration). The host manages one or more MCP clients. Client: A component within the host that maintains a 1:1 connection to a specific MCP server.' },
    { emoji: '🔍', label: 'In Detail', text: 'MCP (Model Context Protocol) was released by Anthropic in November 2024 as an open specification. It defines how AI-powered applications (hosts/clients) communicate with external servers that provide tools, data, and prompt templates.' },
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
