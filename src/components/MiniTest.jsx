import { useState } from 'react'

export default function MiniTest({ preguntas, onComplete, resultados = {}, onAnswer }) {
  const [respuestas, setRespuestas] = useState(resultados)

  function responder(pregId, idx) {
    if (respuestas[pregId] !== undefined) return
    const pregunta = preguntas.find(p => p.id === pregId)
    const esCorrecta = idx === pregunta.correcta
    const nuevas = { ...respuestas, [pregId]: { elegida: idx, correcta: esCorrecta } }
    setRespuestas(nuevas)
    onAnswer?.(pregId, esCorrecta)
    if (Object.keys(nuevas).length === preguntas.length) {
      onComplete?.(nuevas)
    }
  }

  const respondidas = Object.keys(respuestas).length
  const correctas = Object.values(respuestas).filter(r => r.correcta).length

  return (
    <div className="minitest-container">
      <div className="minitest-title">
        ✦ MINI-TEST — {respondidas}/{preguntas.length} respondidas
        {respondidas === preguntas.length && (
          <span style={{ marginLeft: '1rem', color: correctas === preguntas.length ? 'var(--green)' : 'var(--accent)' }}>
            {correctas}/{preguntas.length} correctas
          </span>
        )}
      </div>

      {preguntas.map((preg) => {
        const resp = respuestas[preg.id]
        return (
          <div key={preg.id} className="question-block">
            <div className="question-text">{preg.pregunta}</div>
            <div className="options-grid">
              {preg.opciones.map((op, idx) => {
                let cls = 'option-btn'
                if (resp !== undefined) {
                  if (idx === preg.correcta) cls += ' correct'
                  else if (idx === resp.elegida && !resp.correcta) cls += ' wrong'
                }
                return (
                  <button
                    key={idx}
                    className={cls}
                    onClick={() => responder(preg.id, idx)}
                    disabled={resp !== undefined}
                  >
                    {String.fromCharCode(65 + idx)}) {op}
                  </button>
                )
              })}
            </div>
            {resp !== undefined && (
              <div className={`explicacion ${resp.correcta ? '' : 'wrong'}`}>
                {resp.correcta ? '✓ Correcto. ' : '✗ Incorrecto. '}{preg.explicacion}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
