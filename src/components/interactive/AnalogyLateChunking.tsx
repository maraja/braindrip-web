import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyLateChunking() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📖', label: 'Read Then Excerpt', text: 'Traditional chunking is like cutting a book into pieces before reading it — each piece loses context from surrounding text. Late chunking reads the entire book first (processes the whole document through the embedding model), then cuts it into pieces. Each chunk\'s embedding retains awareness of the full document context because the token embeddings were computed with attention to the whole text before being pooled into chunk vectors.' },
    { emoji: '📸', label: 'Panorama Then Crop', text: 'Normal chunking is like taking separate photos of each section. Late chunking takes a panoramic photo first (encodes the full document), then crops it into sections. Each cropped section "remembers" the panorama it came from — pronouns resolve to their referents, abbreviations expand in context, and topic transitions make sense. The result: chunk embeddings that are contextually richer than independently encoded chunks.' },
    { emoji: '🧩', label: 'Pre-Assembled Puzzle', text: 'Imagine assembling a puzzle, taking a photo, then cutting it into regions. Each region shows its piece in the context of neighbors. That\'s late chunking: the model first processes all tokens with full document attention (assembles the puzzle), then groups them into chunks (cuts into regions). Each chunk embedding benefits from the full-document context without requiring full-document embeddings at retrieval time.' },
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
