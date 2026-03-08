import { useState } from 'react';
export default function QuizAACActionSpaceDesign() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'More tools always means a more capable agent.', isTrue: false, explanation: 'Beyond approximately 20 tools, each additional tool reduces the agent\'s ability to select correctly from the existing set. Capability from additional tools must be weighed against the degradation in tool selection accuracy.' },
    { text: '5-20 tools for most agent systems.', isTrue: true, explanation: 'Claude Code uses approximately 10-15 core tools. Cursor uses a similar range.' },
    { text: 'Tools just need a name and parameters — descriptions don\'t matter much.', isTrue: false, explanation: 'Tool descriptions are the primary mechanism the LLM uses to decide which tool to call. In ablation studies, removing or degrading tool descriptions reduces tool selection accuracy by 20-40%.' },
    { text: 'Each tool description consumes 100-500 tokens in the system prompt.', isTrue: true, explanation: '15 tools at 300 tokens each = 4,500 tokens of system prompt dedicated to tool definitions. This is a meaningful fraction of the context budget.' },
    { text: 'The LLM can figure out how to use a tool from its name alone.', isTrue: false, explanation: 'LLMs often have training data about common tools (file operations, web search), but for custom tools, the LLM relies entirely on the description and schema. A tool named xq_process_v2 with no description will be used incorrectly or not at all.' },
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
