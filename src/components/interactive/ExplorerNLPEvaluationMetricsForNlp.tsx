import { useState } from 'react';

const DETAILS = [
    { label: 'BLEU on WMT En-De', detail: 'State-of-the-art systems score 35--42; human translations score 30--40 against other human references due to valid variation.' },
    { label: 'ROUGE on CNN/DailyMail', detail: 'Top abstractive systems achieve ROUGE-1/ROUGE-2/ROUGE-L of approximately 47/23/44.' },
    { label: 'BERTScore', detail: 'Uses RoBERTa-large by default; adding IDF weighting from the test corpus improves correlation by ~1 point.' },
    { label: 'Perplexity baselines', detail: 'GPT-2 small (117M) = 65.9, GPT-2 large (774M) = 35.7, GPT-3 (175B) = 20.5 on WikiText-103.' },
    { label: 'SacreBLEU', detail: '(Post, 2018) standardizes BLEU computation (tokenization, reference handling) to ensure reproducibility -- raw BLEU scores are not comparable across papers without it.' },
    { label: 'COMET', detail: '(Rei et al., 2020): A learned metric using cross-lingual embeddings, achieving 0.90+ Kendall correlation with human judgments on WMT, now preferred over BLEU for MT evaluation.' },
];

export default function ExplorerNLPEvaluationMetricsForNlp() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Evaluation Metrics for NLP — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of evaluation metrics for nlp.
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
