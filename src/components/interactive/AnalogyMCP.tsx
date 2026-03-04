import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMCP() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🔌', label: 'USB Standard', text: 'Before USB, every device had its own proprietary connector. MCP (Model Context Protocol) is the USB of AI tool integration — a standard protocol that lets any LLM connect to any tool or data source through a universal interface. Instead of building custom integrations for each model-tool pair, you build one MCP server and every MCP-compatible client can use it.' },
    { emoji: '🌐', label: 'HTTP for AI', text: 'HTTP standardized how browsers talk to web servers, enabling the web to flourish. MCP standardizes how AI models talk to external tools and data sources. An MCP server exposes tools (functions the model can call), resources (data it can read), and prompts (templates). Any MCP client can discover and use them — creating an open ecosystem of interoperable AI capabilities.' },
    { emoji: '🔧', label: 'Universal Tool Belt', text: 'Without MCP, each AI app builds its own tool integrations from scratch. MCP is like a universal tool belt with standardized attachment points — a Notion MCP server, a GitHub MCP server, a database MCP server all plug into any compatible AI assistant. The model discovers available tools dynamically and uses them through a standard JSON-RPC protocol. Build once, use everywhere.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
