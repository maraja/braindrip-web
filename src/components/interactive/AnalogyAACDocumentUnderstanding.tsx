import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACDocumentUnderstanding() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine handing a stack of documents to a new employee: a PDF contract with tables and footnotes, a scanned invoice, a spreadsheet with merged cells, and a technical diagram with annotations.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Before extracting content, the system must understand the document\'s visual structure. Layout analysis models (like LayoutLMv3, DiT, or YOLO-based detectors) identify regions of the page and classify them as titles, paragraphs, tables, figures, headers, footers, or sidebars.' },
    { emoji: '🔍', label: 'In Detail', text: 'Most RAG systems treat documents as flat text. They run a PDF through a text extractor, chop the output into chunks, embed them, and call it done. This works for simple text-heavy documents but fails catastrophically for documents where layout, tables, images, and formatting carry meaning.' },
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
