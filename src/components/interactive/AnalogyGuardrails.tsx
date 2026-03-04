import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyGuardrails() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🛡️', label: 'Highway Barriers', text: 'Highway guardrails don\'t control how you drive, but they prevent you from going off a cliff. AI guardrails work similarly — they don\'t dictate the model\'s response but add input/output filters that block dangerous content, validate output format, detect prompt injections, and ensure responses stay within acceptable boundaries. They\'re a safety net around the model, not a replacement for alignment.' },
    { emoji: '🏗️', label: 'Building Safety Systems', text: 'Buildings have fire alarms, sprinklers, emergency exits, and structural codes — layers of safety systems. Guardrails add similar layers around LLMs: input classifiers screen for malicious prompts, output validators check for harmful content, topic filters block forbidden subjects, and format validators ensure structured output. Multiple independent layers provide defense in depth.' },
    { emoji: '⚖️', label: 'Regulatory Compliance', text: 'A bank has compliance rules: transactions over $10K get flagged, certain countries are blocked, unusual patterns trigger review. Guardrails implement similar rules for LLM applications: PII detection prevents data leakage, topic classifiers enforce scope, hallucination detectors flag unreliable outputs, and moderation APIs check content safety. They\'re programmable policies wrapped around the model.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
