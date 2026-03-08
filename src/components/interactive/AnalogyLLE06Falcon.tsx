import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE06Falcon() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two chefs given the same budget. One invests in exotic ingredients and cutting-edge kitchen equipment. The other uses basic ingredients — the same vegetables and grains available at any market — but spends months developing techniques for selecting, cleaning, and preparing them. The second chef wins the competition.' },
    { emoji: '⚙️', label: 'How It Works', text: 'RefinedWeb was the centerpiece of Falcon\'s approach. Starting from Common Crawl, the TII team applied an aggressive multi-stage filtering pipeline:  Language identification (keeping only English text) URL filtering (removing adult, spam, and low-quality domains) Document-level deduplication using MinHash (reducing near-duplicate content by over.' },
    { emoji: '🔍', label: 'In Detail', text: 'Falcon was the second chef. While most labs focused on bigger models, better architectures, or proprietary training data, the Technology Innovation Institute (TII) in Abu Dhabi bet on a different thesis: that the quality of publicly available web data, if cleaned aggressively enough, could rival any curated corpus.' },
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
