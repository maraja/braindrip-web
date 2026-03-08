import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function ScaleLLE05ElmoAndContextualEmbeddings() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u26A1 REAL-WORLD IMPACT</p>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.5, marginBottom: 12 }}>How does ELMo and Contextual Embeddings matter in practice?</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #C76B4A', background: 'transparent', color: '#C76B4A', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reveal Impact \u2192
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Breaking the Static Embedding Paradigm:</strong> ELMo demonstrated that contextual representations were strictly superior to static ones. On the SQuAD question answering benchmark, swapping GloVe for ELMo improved F1 from 81.1 to 85.8.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Discovering Layer Specialization:</strong> The finding that different layers of a language model encode different types of linguistic information was profound. It suggested that deep language models learn a hierarchy of language structure — from syntax to semantics — analogous to how deep CNNs learn a hierarchy of visual features from edges to objects.</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#C76B4A0C', borderRadius: 10, borderLeft: '3px solid #C76B4A' }}>
            <p style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5, margin: 0 }}><strong>Establishing Pre-train Then Fine-tune:</strong> While 06-ulmfit-and-transfer-learning.md (published around the same time) more formally established the transfer learning framework for NLP, ELMo powerfully demonstrated that representations learned from unsupervised language modeling transfer to supervised tasks. The community recognized that training on massive unlabeled text could provide a universal initialization — a paradigm that 02-gpt-1.md and 03-bert.md would turbocharge months later.</p>
          </div>
        </div>
      )}
    </div>
  );
}
