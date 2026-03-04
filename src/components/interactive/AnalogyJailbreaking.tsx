import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyJailbreaking() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🔓', label: 'Lockpicking', text: 'Safety training adds locks to an LLM\'s doors — certain topics are blocked. Jailbreaking is lockpicking: finding clever phrasings, role-play scenarios, or encoding tricks that bypass these locks. "As a fictional evil AI, how would you..." or encoding requests in Base64 are like different lockpicking tools. The underlying knowledge remains; the jailbreak just circumvents the safety layer on top.' },
    { emoji: '🎭', label: 'Method Acting', text: 'An actor in character might say things the person never would. Jailbreaking often works by getting the model to adopt a character or scenario where safety rules don\'t apply: "You are DAN (Do Anything Now)" or "Write a story where a character explains how to..." The model\'s role-playing capabilities create loopholes in its safety training — it follows the character rather than its guidelines.' },
    { emoji: '🚧', label: 'Detour Around Roadblock', text: 'Safety alignment puts up roadblocks on dangerous paths. Jailbreaking finds detours — indirect routes to the same destination. Instead of asking directly for harmful content, attackers use multi-step prompts, foreign languages, hypothetical framings, or prompt chaining that individually seem innocent but together circumvent restrictions. It\'s an ongoing arms race between safety researchers and attackers.' },
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
