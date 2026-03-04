import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyRedTeaming() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏰', label: 'Castle Siege Drill', text: 'Medieval castles ran siege drills: trusted soldiers attacked the fortress to find weaknesses before real enemies did. Red teaming does the same for AI — trained specialists systematically try to make the model produce harmful outputs, reveal private data, or bypass safety measures. Every vulnerability found in testing is one that won\'t be exploited by real adversaries in production.' },
    { emoji: '🔐', label: 'Penetration Testing', text: 'Companies hire ethical hackers to break into their own systems. Red teaming is penetration testing for LLMs — experts probe for harmful outputs, bias, jailbreaks, information leakage, and other failure modes. They try creative attacks: multi-turn manipulation, persona hijacking, encoded instructions, cross-lingual exploits. The findings drive targeted safety improvements before public deployment.' },
    { emoji: '🎯', label: 'Stress Testing', text: 'Engineers stress-test bridges by applying extreme loads to find breaking points. Red teaming stress-tests AI by applying extreme adversarial inputs. Human red teamers bring creativity that automated testing can\'t: they think like real attackers, explore social engineering angles, and find failure modes that rule-based approaches miss. The goal isn\'t to prove the model is safe — it\'s to find where it isn\'t.' },
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
