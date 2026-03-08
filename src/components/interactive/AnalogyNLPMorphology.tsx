import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPMorphology() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'If syntax is the blueprint for building sentences, morphology is the blueprint for building words. Consider the English word "unbelievably": it is not an atomic unit but a construction assembled from four pieces -- "un-" (negation prefix), "believe" (root verb), "-able" (adjective-forming suffix), and "-ly" (adverb-forming suffix).' },
    { emoji: '⚙️', label: 'How It Works', text: 'A free morpheme can stand alone as a word ("book," "run," "happy"). A bound morpheme must attach to another morpheme ("-s," "-ing," "un-," "-ness"). Bound morphemes are further classified:  Prefixes attach before the root: "un-happy," "re-write," "pre-heat" Suffixes attach after the root: "happi-ness," "walk-ed," "teach-er" Infixes insert inside.' },
    { emoji: '🔍', label: 'In Detail', text: 'These minimal meaningful units are called morphemes. Morphology is the branch of linguistics that studies how morphemes combine to form words, and how those combinations affect meaning and grammatical function.' },
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
