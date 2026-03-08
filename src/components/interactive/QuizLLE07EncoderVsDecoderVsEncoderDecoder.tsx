import { useState } from 'react';
export default function QuizLLE07EncoderVsDecoderVsEncoderDecoder() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Decoder-only is objectively the best architecture.', isTrue: false, explanation: 'Decoder-only dominates the frontier because it scales well, attracts investment, and supports generation. But for embedding, retrieval, and classification, encoders are more parameter-efficient.' },
    { text: 'BERT (110M/340M, 2018), RoBERTa (125M/355M, 2019), DeBERTa (390M-1.5B, 2020), ModernBERT (149M/395M, 2024)', isTrue: true, explanation: 'BERT (110M/340M, 2018), RoBERTa (125M/355M, 2019), DeBERTa (390M-1.5B, 2020), ModernBERT (149M/395M, 2024)' },
    { text: 'Encoder-only models are obsolete.', isTrue: false, explanation: 'Encoder models power the majority of production search, classification, and embedding systems. BERT-based models handle billions of queries daily in Google Search.' },
    { text: 'GPT-1 (117M, 2018), GPT-2 (1.5B, 2019), GPT-3 (175B, 2020), PaLM (540B, 2022), LLaMA 3 (8B-405B, 2024)', isTrue: true, explanation: 'GPT-1 (117M, 2018), GPT-2 (1.5B, 2019), GPT-3 (175B, 2020), PaLM (540B, 2022), LLaMA 3 (8B-405B, 2024)' },
    { text: 'Encoder-decoder is just encoder + decoder stapled together.', isTrue: false, explanation: 'The cross-attention mechanism — where the decoder attends to encoder representations — is the critical component that differentiates encoder-decoder from simply running an encoder then a decoder. This architectural feature allows the decoder to dynamically consult different parts of the encoded input at each generation step.' },
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
