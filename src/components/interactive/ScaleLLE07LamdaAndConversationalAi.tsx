import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function ScaleLLE07LamdaAndConversationalAi() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u26A1 REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>How does LaMDA and Conversational AI matter in practice?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact \u2192
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Conversation-Specific Training:</strong> LaMDA demonstrated that training a model specifically for dialogue — both in pre-training data composition and in fine-tuning objectives — produced substantially better conversational AI than simply scaling up a general-purpose language model. This lesson was not lost on the industry: ChatGPT\'s success seven months later relied heavily on conversational fine-tuning via RLHF, and every subsequent chatbot product prioritized conversational data and evaluation.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Safety as a Training Objective:</strong> LaMDA was one of the first major models to explicitly incorporate safety as a fine-tuning objective rather than treating it as a post-hoc filter. The multi-dimensional approach — training the model to be simultaneously safe, grounded, and high-quality — anticipated the alignment research that would become central to the field in 2023-2024.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Bringing AI to Mainstream Consciousness:</strong> The Lemoine incident, while scientifically unfounded, had an outsized cultural impact. It was many people\'s first encounter with the idea that AI could produce text so convincing that a person working with it daily might believe it was conscious.</p>
          </div>
        </div>
      )}
    </div>
  );
}
