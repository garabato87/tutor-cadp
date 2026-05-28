import { useState } from 'react'

const NIVELES = { 1: 'Nivel 1 — Básico', 2: 'Nivel 2 — Medio', 3: 'Nivel 3 — Difícil' }

export default function Ejercicio({ ejercicio, isDone, onDone }) {
  const [codigo, setCodigo] = useState('')
  const [mostrarPista, setMostrarPista] = useState(false)
  const [mostrarSolucion, setMostrarSolucion] = useState(false)
  const [mostrarReto, setMostrarReto] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [analizando, setAnalizando] = useState(false)
  const [abierto, setAbierto] = useState(false)

  async function analizarCodigo() {
    if (!codigo.trim()) return
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey) {
      setFeedback('Para usar el análisis de IA, agregá VITE_ANTHROPIC_API_KEY en tu archivo .env')
      return
    }
    setAnalizando(true)
    setFeedback('')
    try {
      const prompt = `Sos un tutor de Pascal de la cátedra CADP (UNLP). Analizá el siguiente código Pascal del alumno para el ejercicio: "${ejercicio.titulo}".

Enunciado: ${ejercicio.enunciado}

Código del alumno:
\`\`\`pascal
${codigo}
\`\`\`

Dá feedback específico en español. Indicá:
1. Si la lógica es correcta
2. Errores de sintaxis o lógica (si los hay)
3. Si usa la notación correcta de la cátedra (var, pude, etc.)
4. Una sugerencia concreta de mejora si aplica
Sé conciso (máx 5 líneas).`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await res.json()
      setFeedback(data.content?.[0]?.text || 'No se pudo obtener respuesta.')
    } catch {
      setFeedback('Error al conectar con la API. Verificá tu API key en .env')
    } finally {
      setAnalizando(false)
    }
  }

  return (
    <div className={`ejercicio-card ${isDone ? 'done' : ''}`}>
      <div className="ejercicio-header" onClick={() => setAbierto(!abierto)} style={{ cursor: 'pointer' }}>
        <span className={`ejercicio-nivel nivel-${ejercicio.nivel}`}>{NIVELES[ejercicio.nivel]}</span>
        <span className="ejercicio-titulo">{ejercicio.titulo}</span>
        {isDone && <span style={{ color: 'var(--green)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>✓ hecho</span>}
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{abierto ? '▲' : '▼'}</span>
      </div>

      {abierto && (
        <div className="ejercicio-body">
          <pre className="enunciado-text">{ejercicio.enunciado}</pre>

          <textarea
            className="code-editor"
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            placeholder="Escribí tu solución en Pascal aquí..."
            spellCheck={false}
          />

          <div className="btn-row">
            <button className="btn btn-secondary" onClick={() => setMostrarPista(!mostrarPista)}>
              {mostrarPista ? 'Ocultar pista' : '💡 Pista'}
            </button>
            <button className="btn btn-secondary" onClick={() => setMostrarSolucion(!mostrarSolucion)}>
              {mostrarSolucion ? 'Ocultar solución' : '📖 Ver solución'}
            </button>
            {ejercicio.retoExtra && (
              <button className="btn btn-ghost" onClick={() => setMostrarReto(!mostrarReto)}>
                ⚡ Reto extra
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={analizarCodigo}
              disabled={analizando || !codigo.trim()}
            >
              {analizando ? <><span className="spinner" />Analizando...</> : '🤖 Analizar con IA'}
            </button>
            {!isDone && (
              <button className="btn btn-done" onClick={() => onDone(ejercicio.id)}>
                ✓ Marcar como hecho
              </button>
            )}
          </div>

          {mostrarPista && (
            <div className="hint-box">
              <strong style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', letterSpacing: '0.05em' }}>PISTA</strong>
              {ejercicio.pista}
            </div>
          )}

          {mostrarSolucion && (
            <pre className="solution-box">{ejercicio.solucion}</pre>
          )}

          {mostrarReto && ejercicio.retoExtra && (
            <div className="reto-box">
              <strong>⚡ RETO EXTRA</strong>
              {ejercicio.retoExtra}
            </div>
          )}

          {feedback && (
            <div className="feedback-box">
              <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.05em' }}>
                FEEDBACK DE IA
              </strong>
              {feedback}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
