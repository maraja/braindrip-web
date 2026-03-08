import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACApiIntegration() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of an API as a restaurant menu with precise ordering instructions. The menu (API documentation) tells you what dishes (endpoints) are available, what customizations (parameters) you can request, and the format for placing your order (request structure). The kitchen (server) prepares your order and returns it through the window (response).' },
    { emoji: '⚙️', label: 'How It Works', text: 'Before an agent can use an API, the available endpoints must be described as tool schemas the LLM can understand. This can be done manually (writing function definitions) or automatically by parsing OpenAPI/Swagger specifications. Tools like openapi-to-functions convert OpenAPI specs into LLM-compatible function schemas.' },
    { emoji: '🔍', label: 'In Detail', text: 'API integration is the practice of connecting AI agents to external services — weather data, CRM systems, payment processors, email providers, databases, and thousands of other services that expose programmatic interfaces.' },
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
