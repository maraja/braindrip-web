import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const schema = '{ "name": string, "age": integer }';

const steps = [
  { state: 'OBJECT_OPEN', generated: '', nextToken: '{', grammar: 'object -> "{" members "}"', validMask: ['{'], blocked: ['"', '[', 'true', '42', 'null', '}'], explanation: 'Grammar requires object to start with open brace.' },
  { state: 'FIRST_KEY', generated: '{', nextToken: '"name"', grammar: 'member -> string ":" value', validMask: ['"name"', '"age"'], blocked: ['{', '}', ':', '42', 'true'], explanation: 'After "{", only quoted property keys from the schema are valid.' },
  { state: 'COLON_1', generated: '{ "name"', nextToken: ':', grammar: 'member -> string ":" value', validMask: [':'], blocked: ['{', '}', '"text"', '42', ','], explanation: 'Grammar mandates a colon after the property key.' },
  { state: 'STRING_VALUE', generated: '{ "name" :', nextToken: '"Alice"', grammar: 'value -> string', validMask: ['"Alice"', '"Bob"', '"Eve"'], blocked: ['42', 'true', '{', '[', 'null'], explanation: 'Schema declares "name" as string type. Only string tokens allowed.' },
  { state: 'COMMA_1', generated: '{ "name" : "Alice"', nextToken: ',', grammar: 'members -> member "," members', validMask: [','], blocked: ['}', ':', '"text"', '42'], explanation: 'Schema has another required field, so comma is mandatory here.' },
  { state: 'SECOND_KEY', generated: '{ "name" : "Alice" ,', nextToken: '"age"', grammar: 'member -> string ":" value', validMask: ['"age"'], blocked: ['"name"', '{', '}', '42', 'true'], explanation: 'Only remaining required key "age" is valid. "name" already used.' },
  { state: 'COLON_2', generated: '{ "name" : "Alice" , "age"', nextToken: ':', grammar: 'member -> string ":" value', validMask: [':'], blocked: ['{', '}', ',', '42'], explanation: 'Colon required between key and value.' },
  { state: 'INT_VALUE', generated: '{ "name" : "Alice" , "age" :', nextToken: '30', grammar: 'value -> integer', validMask: ['25', '30', '42', '0'], blocked: ['"text"', 'true', '{', 'null'], explanation: 'Schema declares "age" as integer. Only numeric tokens pass the mask.' },
  { state: 'OBJECT_CLOSE', generated: '{ "name" : "Alice" , "age" : 30', nextToken: '}', grammar: 'object -> "{" members "}"', validMask: ['}'], blocked: [',', ':', '"key"', '42'], explanation: 'All required fields present. Only closing brace is valid.' },
];

export default function GrammarMaskDemo() {
  const [step, setStep] = useState(0);
  const s = steps[step];
  const isDone = step >= steps.length - 1;
  const finalOutput = '{ "name" : "Alice" , "age" : 30 }';

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Grammar-Guided Generation
        </h3>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#7A6F5E', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.3rem' }}>JSON Schema</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#D4A843', padding: '0.5rem 0.75rem', background: '#2C3E2D', borderRadius: '8px' }}>
          {schema}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' as const }}>
        <div style={{ flex: '1 1 55%' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#7A6F5E', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Grammar Rule</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#C76B4A', padding: '0.5rem 0.75rem', background: 'rgba(199,107,74,0.06)', borderRadius: '8px', border: '1px solid rgba(199,107,74,0.15)' }}>
            {s.grammar}
          </div>
        </div>
        <div style={{ flex: '1 1 35%' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#7A6F5E', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.3rem' }}>FSM State</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#8BA888', padding: '0.5rem 0.75rem', background: 'rgba(139,168,136,0.08)', borderRadius: '8px', border: '1px solid rgba(139,168,136,0.15)', fontWeight: 600 }}>
            {s.state}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', padding: '0.6rem 0.8rem', background: '#EDE9DF', borderRadius: '8px' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A6F5E', marginBottom: '0.25rem' }}>Generated Output (Step {step + 1}/{steps.length})</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#2C3E2D' }}>
          {isDone && step === steps.length - 1 ? finalOutput : (
            <>
              {s.generated && <span>{s.generated} </span>}
              <span style={{ color: '#C76B4A', fontWeight: 700, textDecoration: 'underline' }}>{s.nextToken}</span>
              <span style={{ color: '#C5BFB3' }}> |</span>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <div style={{ flex: '1 1 45%' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#8BA888', marginBottom: '0.3rem' }}>Allowed (mask = 1)</div>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' as const }}>
            {s.validMask.map((t, i) => (
              <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '5px', background: 'rgba(139,168,136,0.15)', color: '#2C3E2D', border: '1px solid #8BA888', fontWeight: t === s.nextToken ? 700 : 400 }}>
                {t} {t === s.nextToken ? '\u2190' : ''}
              </span>
            ))}
          </div>
        </div>
        <div style={{ flex: '1 1 45%' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#C76B4A', marginBottom: '0.3rem' }}>Blocked (mask = 0)</div>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' as const }}>
            {s.blocked.map((t, i) => (
              <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '5px', background: 'rgba(199,107,74,0.06)', color: '#C5BFB3', border: '1px solid #E5DFD3', textDecoration: 'line-through' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.78rem', color: '#7A6F5E', lineHeight: 1.5, marginBottom: '1rem', fontStyle: 'italic' }}>
        {s.explanation}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => setStep(prev => Math.min(prev + 1, steps.length - 1))} disabled={isDone} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: 'none', background: isDone ? '#8BA888' : '#C76B4A', color: 'white', cursor: isDone ? 'default' : 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem' }}>
          {isDone ? 'Valid JSON Complete!' : 'Next Token'}
        </button>
        <button onClick={() => setStep(0)} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: '1px solid #E5DFD3', background: 'white', color: '#2C3E2D', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }}>
          Reset
        </button>
      </div>
    </div>
  );
}
