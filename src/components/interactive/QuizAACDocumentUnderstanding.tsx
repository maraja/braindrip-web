import { useState } from 'react';
export default function QuizAACDocumentUnderstanding() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'PDFs are just text files.', isTrue: false, explanation: 'PDFs are a presentation format, not a data format. They specify where to draw characters on a page but do not encode paragraph structure, reading order, or table relationships.' },
    { text: 'PyMuPDF (fitz), pdfplumber, and PyPDF2 extract text from born-digital PDFs.', isTrue: true, explanation: 'pdfplumber is particularly strong at preserving table structure. For complex PDFs, combining library extraction with LLM-based correction yields the best results.' },
    { text: 'OCR is a solved problem.', isTrue: false, explanation: 'OCR works well on clean, printed documents with standard fonts. It degrades significantly on handwriting, degraded scans, unusual layouts, watermarks, and non-Latin scripts.' },
    { text: 'Naive fixed-size chunking destroys document structure.', isTrue: true, explanation: 'Structure-aware chunking respects document sections, keeps tables intact, associates figures with their captions, and maintains header hierarchy. Each chunk should include its structural context (e.g., "Section 3.2 &gt; Table 4 &gt; Row: Q3 Revenue").' },
    { text: 'Vision models eliminate the need for document parsing pipelines.', isTrue: false, explanation: 'Vision models are powerful but expensive ($0.01-0.05 per page), slow (seconds per page), and can hallucinate details in tables and figures. For high-volume processing, pipeline-based approaches are more cost-effective, with vision models reserved for complex pages that pipelines handle poorly.' },
  ];
  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '1.5rem', margin: '2rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#C76B4A', fontWeight: 600 }}>&#10022;</span>
        <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: '1rem', fontWeight: 600, color: '#2C3E2D' }}>Quick Check</span>
        <span style={{ fontSize: '0.7rem', color: '#8BA888', fontFamily: "'JetBrains Mono', monospace", marginLeft: 'auto' }}>
          {Object.keys(answers).length}/{questions.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {questions.map((q, i) => (
          <div key={i} style={{ background: answers[i] !== undefined ? (answers[i] === q.isTrue ? '#f0f7f0' : '#fdf0ed') : '#F0EBE1', borderRadius: '10px', padding: '0.875rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#2C3E2D', margin: 0, lineHeight: 1.5 }}>{q.text}</p>
            {answers[i] === undefined ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button onClick={() => setAnswers(a => ({ ...a, [i]: true }))} style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'white', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D' }}>True</button>
                <button onClick={() => setAnswers(a => ({ ...a, [i]: false }))} style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'white', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D' }}>False</button>
              </div>
            ) : (
              <p style={{ fontSize: '0.78rem', color: answers[i] === q.isTrue ? '#4a7c59' : '#C76B4A', marginTop: '0.375rem', marginBottom: 0, lineHeight: 1.4 }}>
                {answers[i] === q.isTrue ? '\u2713 ' : '\u2717 '}{q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
