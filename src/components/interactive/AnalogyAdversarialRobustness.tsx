import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyAdversarialRobustness() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏰', label: 'Fortress Design', text: 'A fortress isn\'t just built to withstand weather — it\'s designed to resist active attackers trying to breach it. Adversarial robustness is building AI that withstands deliberate attacks: carefully crafted inputs designed to cause misclassification, bypass safety measures, or extract private training data. It\'s the difference between reliability (handling natural variation) and security (handling intentional manipulation).' },
    { emoji: '💉', label: 'Immune System', text: 'Your immune system doesn\'t just fight common colds — it handles novel pathogens it\'s never seen. Adversarial robustness trains models to be resilient against attacks they weren\'t specifically prepared for: perturbed inputs, token manipulations, multi-step jailbreaks. Techniques include adversarial training (exposing the model to attacks during training), certified defenses, and input preprocessing that neutralizes common attack vectors.' },
    { emoji: '🔐', label: 'Bank Vault', text: 'A bank vault isn\'t just locked — it\'s designed to resist drilling, explosives, and social engineering. Adversarial robustness hardens AI systems against the equivalent attacks: gradient-based adversarial examples, prompt injection, data poisoning, and model extraction. Like vault design, it assumes motivated attackers with sophisticated tools, not just accidental misuse.' },
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
