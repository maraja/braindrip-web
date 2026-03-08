import { useState } from 'react';

const DETAILS = [
    { label: 'PDF parsing libraries', detail: 'PyMuPDF (fitz), pdfplumber, and PyPDF2 extract text from born-digital PDFs. pdfplumber is particularly strong at preserving table structure. For complex PDFs, combining library extraction with LLM-based correction yields the best results.' },
    { label: 'Chunking strategies for structured documents', detail: 'Naive fixed-size chunking destroys document structure. Structure-aware chunking respects document sections, keeps tables intact, associates figures with their captions, and maintains header hierarchy. Each chunk should include its structural context (e.g., "Section 3.2 &gt; Table 4 &gt; Row: Q3 Revenue").' },
    { label: 'Image extraction and captioning', detail: 'Figures and charts embedded in documents are extracted as images and processed separately. Vision models generate descriptive captions or structured data (e.g., extracting data points from a bar chart). These captions are indexed alongside the text for retrieval.' },
    { label: 'Metadata preservation', detail: 'Document understanding preserves metadata: page numbers, section titles, document title, author, date, and the position of each element. This metadata is critical for source citation and for answering questions that reference specific locations in a document.' },
    { label: 'Quality scoring', detail: 'Each extracted element receives a quality score based on OCR confidence, layout detection confidence, and structural consistency. Low-quality extractions are flagged for human review or excluded from the retrieval index.' },
    { label: 'Batch vs real-time processing', detail: 'Document understanding is computationally expensive. Production systems typically process documents in batch during ingestion, storing the extracted structured data. Real-time processing (for newly uploaded documents) uses a separate fast pipeline, possibly with lower fidelity.' },
];

export default function ExplorerAACDocumentUnderstanding() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Document Understanding \u2014 Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {DETAILS.map((d, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} style={{
            textAlign: 'left' as const, background: open === i ? '#F0EBE1' : '#FDFBF7', border: '1px solid #E5DFD3',
            borderRadius: '10px', padding: '0.875rem 1rem', cursor: 'pointer', width: '100%', transition: 'background 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.95rem', fontWeight: 600, color: '#2C3E2D' }}>
                {d.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#7A8B7C', transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                &#9654;
              </span>
            </div>
            {open === i && (
              <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: '0.5rem 0 0 0' }}>
                {d.detail}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
