import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function ScaleLLE07TheSlmRevolution() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u26A1 REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>How does The SLM Revolution matter in practice?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact \u2192
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Redefining the Frontier:</strong> The SLM revolution challenges the notion that "frontier" means "biggest." The true frontier in 2025 isn\'t just the most powerful model -- it\'s the model that delivers the best performance for a given compute budget, latency requirement, or deployment constraint. A 7B model that runs in 100ms on a phone is more "frontier" for mobile applications than a 400B model that requires a data center and 2 seconds of latency.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Democratizing AI Deployment:</strong> When capable AI requires only consumer hardware, the barrier to deployment drops by orders of magnitude. A startup in Nairobi, a hospital in rural India, or a school in Southeast Asia can run AI applications without cloud subscriptions, without reliable internet connectivity, and without budget for enterprise GPUs.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>The End of the Monolithic Model:</strong> The SLM revolution points toward a future where AI applications use ecosystems of specialized models rather than a single monolithic system. A coding assistant might use a 3B model for autocomplete, a 14B model for code review, and a frontier model for complex architectural decisions -- all seamlessly, with users unaware of the routing happening behind the scenes.</p>
          </div>
        </div>
      )}
    </div>
  );
}
