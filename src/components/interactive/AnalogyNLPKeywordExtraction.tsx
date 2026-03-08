import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPKeywordExtraction() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine speed-reading a research paper and jotting down 5-10 phrases that capture its essence -- "transfer learning," "domain adaptation," "BERT fine-tuning." You are doing keyword extraction: distilling a document into its most representative terms.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest keyword extraction method ranks candidate terms by their TF-IDF score (see 03-text-representation/tf-idf.md). Terms with high term frequency in the target document but low document frequency across the corpus are likely keywords. The process:  Tokenize and optionally POS-tag the document.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, keyword extraction (or keyphrase extraction) is the task of automatically selecting a small set of terms or phrases from a document that best represent its content. These keyphrases serve as compact document summaries, index terms for retrieval (see information-retrieval.' },
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
