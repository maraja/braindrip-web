import { useState } from 'react';
export default function QuizMLFXgboostLightgbmCatboost() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'XGBoost is always the best choice.', isTrue: false, explanation: 'Each library has strengths. LightGBM is faster on large datasets, CatBoost handles categoricals better, and XGBoost has the broadest ecosystem support.' },
    { text: 'max_depth (3--10), learning_rate (0.01--0.3), n_estimators (100--10000), reg_alpha (L1), reg_lambda (L2), subsample, colsample_bytree.', isTrue: true, explanation: 'max_depth (3--10), learning_rate (0.01--0.3), n_estimators (100--10000), reg_alpha (L1), reg_lambda (L2), subsample, colsample_bytree.' },
    { text: 'Histogram binning loses important information.', isTrue: false, explanation: 'With 255 bins, the information loss is negligible for most practical purposes. The massive speedup far outweighs the tiny accuracy cost.' },
    { text: 'num_leaves (31--255, controls leaf-wise complexity), learning_rate, n_estimators, min_child_samples, feature_fraction, bagging_fraction.', isTrue: true, explanation: 'num_leaves (31--255, controls leaf-wise complexity), learning_rate, n_estimators, min_child_samples, feature_fraction, bagging_fraction.' },
    { text: 'Leaf-wise growth always overfits.', isTrue: false, explanation: 'LightGBM\'s leaf-wise growth can overfit on small datasets, but with proper max_depth and min_child_samples constraints, it generalizes well. On large datasets, it often outperforms level-wise growth.' },
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
