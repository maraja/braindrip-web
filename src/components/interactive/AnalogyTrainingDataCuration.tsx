import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyTrainingDataCuration() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🍷', label: 'Wine Selection', text: 'Training data curation is like a sommelier selecting wines for a cellar. You do not just buy everything — you filter for quality (remove spam, duplicates, toxic content), balance the selection (not all Bordeaux — include Burgundy, Riesling), and ensure provenance (data sourcing ethics). The quality of your cellar determines the quality of every dinner party (model output) for years.' },
    { emoji: '🌾', label: 'Seed Selection', text: 'A farmer does not plant random seeds — they select disease-resistant, high-yield varieties and prepare the soil. Data curation is seed selection: deduplication removes clones, quality filters remove weeds, and careful sourcing ensures variety. Training on 15T tokens of curated data can outperform 100T tokens of uncurated web scrapes. Quality beats quantity.' },
    { emoji: '📚', label: 'Library Acquisition', text: 'A university librarian carefully decides which books to acquire: balancing academic rigor, subject diversity, recency, and budget. Training data curation applies similar judgment at internet scale: classifier-based quality filtering, exact and near-duplicate removal, content safety filtering, domain balancing, and PII scrubbing. The resulting dataset defines what the model can and cannot know.' },
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
