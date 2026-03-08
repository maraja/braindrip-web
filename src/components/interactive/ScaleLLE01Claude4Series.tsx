import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function ScaleLLE01Claude4Series() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u26A1 REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>How does Claude 4 Series matter in practice?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact \u2192
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Redefining What AI Models Do:</strong> The Claude 4 series represents a fundamental shift from "AI that answers questions" to "AI that does work." The combination of sustained agentic performance, computer use, and multi-agent collaboration means Claude can take on entire workflows, not just individual queries. This changes the economic calculus of AI adoption: instead of augmenting human workers on specific subtasks, Claude can autonomously handle complete tasks, with human oversight at the strategic level.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>The Alignment Differentiator:</strong> In a market where capability benchmarks converge (GPT-5, Gemini 2.5, and Claude 4 all achieve similar scores on standard benchmarks), alignment quality becomes a key differentiator. Anthropic\'s investment in reason-based alignment, transparent chain-of-thought, and predictable behavior makes Claude the preferred choice for high-stakes applications where trust and reliability matter more than raw benchmark scores -- healthcare, legal, finance, and safety-critical systems.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>The Million-Token Frontier:</strong> The 1M context window (in beta with Claude 4.6) opens entirely new use cases. Developers can provide an entire codebase as context.</p>
          </div>
        </div>
      )}
    </div>
  );
}
