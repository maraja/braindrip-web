import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFDataCleaningAndPreprocessing() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a chef receiving a delivery of fresh produce. Some tomatoes are bruised, a few onions are mislabeled as garlic, and there is a rock mixed in with the potatoes. No recipe can compensate for rotten ingredients -- the chef must inspect, sort, and prep before cooking.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Exact duplicates (identical rows) are straightforward: df.drop_duplicates(). Near-duplicates require fuzzy matching. For string fields, Levenshtein distance or Jaccard similarity on token sets can identify records like "John Smith, 123 Main St" and "Jon Smith, 123 Main Street" as likely duplicates.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, data cleaning transforms a raw dataset D_&#123;raw&#125; into a curated dataset D_&#123;clean&#125; by applying a sequence of operations -- deduplication, type correction, outlier treatment, noise reduction, and validation -- such that D_&#123;clean&#125; satisfies predefined quality constraints (completeness, consistency, accuracy, timeliness).' },
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
