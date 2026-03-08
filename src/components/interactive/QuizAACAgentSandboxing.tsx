import { useState } from 'react';
export default function QuizAACAgentSandboxing() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Sandboxing slows agents down.', isTrue: false, explanation: 'With warm container pools and modern container runtimes, sandbox overhead is typically under 100ms for container assignment and negligible for runtime performance. The agent\'s execution speed inside a sandbox is essentially identical to bare-metal execution for most workloads.' },
    { text: 'AppArmor or Seccomp profiles restrict which system calls the container can make.', isTrue: true, explanation: 'A well-configured profile blocks dangerous syscalls (mount, reboot, module loading) while allowing normal operation. Docker\'s default seccomp profile blocks about 44 of the 300+ Linux syscalls.' },
    { text: 'Docker is secure enough for any use case.', isTrue: false, explanation: 'Docker containers share the host kernel, meaning kernel exploits can escape the container. For high-security applications or multi-tenant environments, microVMs (Firecracker, gVisor) provide stronger isolation.' },
    { text: 'Docker provides OS-level isolation (shared kernel).', isTrue: true, explanation: 'Firecracker provides hardware-level isolation (separate lightweight VM). Firecracker is more secure but adds ~125ms boot time and slightly more memory overhead.' },
    { text: 'If the agent has no code execution, sandboxing is unnecessary.', isTrue: false, explanation: 'Agents with tool access can still cause damage through tool misuse -- sending wrong API calls, modifying databases, or accessing unauthorized files. Sandboxing constrains not just code execution but all system interactions.' },
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
