import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPDocumentUnderstanding() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine handing a stack of receipts to an accountant. Without reading a single word, the accountant can already extract information from the layout: the total is at the bottom right, the date is at the top, line items are in a table, and the store name is in large bold text at the top center.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A typical document understanding system involves:  Document Digitization / OCR: Converting scanned documents or images into machine-readable text with bounding box coordinates. Modern OCR engines (Tesseract, Google Cloud Vision, Amazon Textract, PaddleOCR) achieve &gt;99% character accuracy on clean printed text but degrade on handwriting, low.' },
    { emoji: '🔍', label: 'In Detail', text: 'Document understanding (also called Document AI or intelligent document processing) is the task of automatically extracting structured information from visually rich documents -- forms, invoices, receipts, contracts, scientific papers, financial statements, and more.' },
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
