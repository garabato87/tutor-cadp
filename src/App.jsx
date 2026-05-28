import { useState, useEffect } from 'react'
import { SUBHABILIDADES, EJERCICIOS } from './data/curriculum.js'
import { PLAN_ESTUDIO } from './data/plan.js'
import { loadProgress, saveProgress, getUserId, setUserId, clearUserId } from './lib/storage.js'
import MiniTest from './components/MiniTest.jsx'
import Ejercicio from './components/Ejercicio.jsx'

const TODAY = '2026-06-13' // fecha del parcial como referencia

function diasHastaParcial() {
  const hoy = new Date()
  const parcial = new Date('2026-06-13')
  const diff = Math.ceil((parcial - hoy) / (1000 * 60 * 60 * 24))
  if (diff < 0) return null
  if (diff === 0) return '¡Hoy es el parcial!'
  return `${diff} día${diff === 1 ? '' : 's'} para el parcial`
}

function calcularProgreso(progress) {
  let total = 0, done = 0
  for (const sk of SUBHABILIDADES) {
    const p = progress[sk.id] || {}
    const mbDone = (p.microbloquesDone || []).length
    const mtDone = Object.values(p.miniTestResults || {}).filter(Boolean).length
    const ejDone = (p.ejerciciosDone || []).length
    const puntos = sk.microbloques.length + sk.miniTest.length + EJERCICIOS.filter(e => e.subhabilidadId === sk.id).length
    total += puntos
    done += mbDone + mtDone + ejDone
  }
  return total > 0 ? Math.round((done / total) * 100) : 0
}

export default function App() {
  const [tab, setTab] = useState('roadmap')
  const [skillId, setSkillId] = useState(SUBHABILIDADES[0].id)
  const [progress, setProgress] = useState({})
  const [mbAbiertos, setMbAbiertos] = useState({})
  const [userId, setUserIdState] = useState(getUserId())

  useEffect(() => {
    if (!userId) return
    loadProgress().then(p => setProgress(p || {}))
  }, [userId])

  function handleLogin(code) {
    const id = setUserId(code)
    if (id) setUserIdState(id)
  }

  function handleLogout() {
    clearUserId()
    setUserIdState(null)
    setProgress({})
  }

  if (!userId) {
    return <LoginView onLogin={handleLogin} />
  }

  // Actualiza el progreso de forma funcional (a partir del estado más reciente)
  // para no perder escrituras si se hacen varios clics seguidos, y persiste.
  function actualizarProgreso(mutar) {
    setProgress(prev => {
      const next = mutar(prev)
      saveProgress(next)
      return next
    })
  }

  // Abre el primer microbloque NO leído de una subhabilidad (flujo guiado).
  function abrirPrimerNoLeido(id) {
    const sk = SUBHABILIDADES.find(s => s.id === id)
    if (!sk) return
    const done = new Set((progress[id]?.microbloquesDone) || [])
    const siguiente = sk.microbloques.find(mb => !done.has(mb.id)) || sk.microbloques[0]
    if (siguiente) setMbAbiertos({ [siguiente.id]: true })
  }

  // Cambia de tema en "Aprender" y abre automáticamente el primer pendiente.
  function seleccionarSkillAprender(id) {
    setSkillId(id)
    abrirPrimerNoLeido(id)
  }

  // Salta directo a la práctica del tema indicado.
  function irAPractica(id) {
    setSkillId(id)
    setTab('ejercicios')
  }

  function marcarMicrobloque(skillId, mbId) {
    const yaLeido = (progress[skillId]?.microbloquesDone || []).includes(mbId)

    actualizarProgreso(prev => {
      const p = { ...prev }
      const ps = p[skillId] || {}
      const done = new Set(ps.microbloquesDone || [])
      yaLeido ? done.delete(mbId) : done.add(mbId)
      p[skillId] = { ...ps, microbloquesDone: [...done] }
      return p
    })

    // Auto-avance (cosmético): al marcar como leído, abrir el siguiente pendiente.
    if (!yaLeido) {
      const sk = SUBHABILIDADES.find(s => s.id === skillId)
      const done = new Set(progress[skillId]?.microbloquesDone || [])
      done.add(mbId)
      const siguiente = sk?.microbloques.find(mb => !done.has(mb.id))
      setMbAbiertos(siguiente ? { [siguiente.id]: true } : {})
    }
  }

  function responderMiniTest(skillId, pregId, correcta) {
    actualizarProgreso(prev => {
      const p = { ...prev }
      const ps = p[skillId] || {}
      p[skillId] = {
        ...ps,
        miniTestResults: { ...(ps.miniTestResults || {}), [pregId]: correcta },
      }
      return p
    })
  }

  function marcarEjercicio(ejId) {
    const ej = EJERCICIOS.find(e => e.id === ejId)
    if (!ej) return
    actualizarProgreso(prev => {
      const p = { ...prev }
      const ps = p[ej.subhabilidadId] || {}
      const done = new Set(ps.ejerciciosDone || [])
      done.add(ejId)
      p[ej.subhabilidadId] = { ...ps, ejerciciosDone: [...done] }
      return p
    })
  }

  function toggleMb(id) {
    setMbAbiertos(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const pct = calcularProgreso(progress)
  const countdown = diasHastaParcial()
  const skill = SUBHABILIDADES.find(s => s.id === skillId)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">
          Tutor CADP <span>Pascal — UNLP</span>
        </div>
        <nav className="tab-nav">
          {[
            { id: 'roadmap', label: '📅 Roadmap' },
            { id: 'aprender', label: '📖 Aprender' },
            { id: 'ejercicios', label: '💻 Ejercicios' },
            { id: 'progreso', label: '📊 Progreso' },
          ].map(t => (
            <button
              key={t.id}
              className={`tab-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        {countdown && <div className="parcial-countdown">⏱ {countdown}</div>}
        <button className="user-chip" onClick={handleLogout} title="Cambiar de código de usuario">
          👤 {userId}
        </button>
      </header>

      <div className="global-progress">
        <div className="global-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <main className="main-content">
        {tab === 'roadmap' && <RoadmapView progress={progress} onSelectSkill={(id) => { seleccionarSkillAprender(id); setTab('aprender') }} />}
        {tab === 'aprender' && (
          <AprendizajeView
            skill={skill}
            allSkills={SUBHABILIDADES}
            ejercicios={EJERCICIOS}
            progress={progress}
            mbAbiertos={mbAbiertos}
            onToggleMb={toggleMb}
            onMarcarMb={marcarMicrobloque}
            onRespuestaMiniTest={responderMiniTest}
            onSelectSkill={seleccionarSkillAprender}
            onGoToPractice={irAPractica}
          />
        )}
        {tab === 'ejercicios' && (
          <EjerciciosView
            skill={skill}
            allSkills={SUBHABILIDADES}
            ejercicios={EJERCICIOS}
            progress={progress}
            onDone={marcarEjercicio}
            onSelectSkill={setSkillId}
            onGoToTheory={(id) => { seleccionarSkillAprender(id); setTab('aprender') }}
          />
        )}
        {tab === 'progreso' && <ProgresoView progress={progress} />}
      </main>
    </div>
  )
}

// ─── LOGIN VIEW ─────────────────────────────────────────────────────────────
function LoginView({ onLogin }) {
  const [code, setCode] = useState('')

  function submit(e) {
    e.preventDefault()
    if (code.trim()) onLogin(code)
  }

  return (
    <div className="login-shell">
      <form className="login-card card" onSubmit={submit}>
        <div className="topbar-brand" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
          Tutor CADP <span>Pascal — UNLP</span>
        </div>
        <div className="section-subtitle" style={{ marginBottom: '1.25rem' }}>
          Escribí tu código de usuario para guardar y recuperar tu progreso desde
          cualquier navegador o dispositivo.
        </div>
        <input
          className="login-input"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ej: braian"
          autoFocus
          spellCheck={false}
        />
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          Entrar
        </button>
        <p className="login-hint">
          Usá siempre el mismo código en todos tus navegadores para compartir el progreso.
        </p>
      </form>
    </div>
  )
}

// ─── ROADMAP VIEW ───────────────────────────────────────────────────────────
function RoadmapView({ progress, onSelectSkill }) {
  const hoy = new Date().toISOString().split('T')[0]
  return (
    <div>
      <div className="section-title">Plan de estudio</div>
      <div className="section-subtitle">29 de mayo → 13 de junio · segundo parcial CADP</div>

      <div className="errores-banner">
        <div className="errores-banner-title">⚠ ERRORES CLÁSICOS QUE PREGUNTA LA CÁTEDRA</div>
        <ul className="errores-list">
          <li>Invertir el orden del while en búsqueda: (not esta) and (pos &lt;= dL) — SIEMPRE (pos &lt;= dL) primero</li>
          <li>Confundir dispose(p) con p := nil — dispose libera memoria, nil solo pierde la referencia</li>
          <li>En insertar de arreglos usar "to" en vez de "downto" — se pisarían los valores</li>
          <li>En eliminar de lista: no hacer dispose(actual) — la memoria no se libera</li>
          <li>La tabla de bytes CAMBIA según el enunciado — siempre leer qué tabla da el problema</li>
        </ul>
      </div>

      <div className="roadmap-grid">
        {PLAN_ESTUDIO.map((dia) => {
          const esHoy = dia.fecha === hoy
          const esPasado = dia.fecha < hoy
          const sk = dia.subhabilidadId
            ? SUBHABILIDADES.find(s => s.id === dia.subhabilidadId)
            : null

          let cls = 'day-card'
          if (dia.esParcial) cls += ' parcial'
          else if (esHoy) cls += ' today'
          else if (dia.descanso) cls += ' descanso'

          return (
            <div
              key={dia.fecha}
              className={cls}
              onClick={() => sk && onSelectSkill(sk.id)}
              style={!sk ? { cursor: 'default' } : {}}
            >
              <div className="day-card-date">{dia.dia}</div>
              <div className="day-card-title" style={{ color: dia.esParcial ? 'var(--accent)' : undefined }}>
                {dia.esParcial ? '🎯 Parcial CADP' : (sk ? `${sk.icono} ${sk.titulo}` : (dia.descanso ? '🌿 Descanso' : dia.temas[0]))}
              </div>
              <div className="day-card-tags">
                {dia.temas.slice(0, 2).map((t, i) => (
                  <span key={i} className="day-tag">{t}</span>
                ))}
              </div>
              {esHoy && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                  ← HOY
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── APRENDIZAJE VIEW ───────────────────────────────────────────────────────
function AprendizajeView({ skill, allSkills, ejercicios, progress, mbAbiertos, onToggleMb, onMarcarMb, onRespuestaMiniTest, onSelectSkill, onGoToPractice }) {
  const p = progress[skill.id] || {}
  const mbDone = new Set(p.microbloquesDone || [])
  const mtResults = p.miniTestResults || {}

  const totalMb = skill.microbloques.length
  const leidos = skill.microbloques.filter(mb => mbDone.has(mb.id)).length
  const teoriaPct = totalMb > 0 ? Math.round((leidos / totalMb) * 100) : 0
  const teoriaCompleta = leidos === totalMb && totalMb > 0
  const mtRespondidas = skill.miniTest.filter(q => mtResults[q.id] !== undefined).length
  const numEjercicios = ejercicios.filter(e => e.subhabilidadId === skill.id).length

  const idx = allSkills.findIndex(s => s.id === skill.id)
  const prevSkill = idx > 0 ? allSkills[idx - 1] : null
  const nextSkill = idx < allSkills.length - 1 ? allSkills[idx + 1] : null

  return (
    <div>
      <div className="skill-tabs">
        {allSkills.map(s => {
          const sp = progress[s.id] || {}
          const done = (sp.microbloquesDone || []).length
          const completo = done === s.microbloques.length && s.microbloques.length > 0
          return (
            <button
              key={s.id}
              className={`skill-tab ${s.id === skill.id ? 'active' : ''}`}
              onClick={() => onSelectSkill(s.id)}
              style={s.id === skill.id ? { borderColor: s.color, color: s.color } : {}}
            >
              {completo ? '✓' : s.icono} {s.titulo}
            </button>
          )
        })}
      </div>

      <div className="section-title">{skill.icono} {skill.titulo}</div>
      <div className="section-subtitle">{skill.descripcion}</div>

      {/* Indicador de avance de teoría */}
      <div className="teoria-tracker">
        <div className="teoria-tracker-top">
          <span>📖 Teoría — <strong>{leidos}/{totalMb}</strong> microbloques leídos</span>
          <span className="teoria-tracker-pct" style={{ color: skill.color }}>{teoriaPct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${teoriaPct}%`, background: skill.color }} />
        </div>
        <div className="teoria-tracker-steps">
          {skill.microbloques.map((mb, i) => (
            <button
              key={mb.id}
              className={`step-dot ${mbDone.has(mb.id) ? 'done' : ''} ${mbAbiertos[mb.id] ? 'active' : ''}`}
              title={mb.titulo}
              onClick={() => onToggleMb(mb.id)}
              style={mbDone.has(mb.id) ? { borderColor: skill.color, color: skill.color } : {}}
            >
              {mbDone.has(mb.id) ? '✓' : i + 1}
            </button>
          ))}
        </div>
      </div>

      {skill.microbloques.map((mb, i) => {
        const done = mbDone.has(mb.id)
        const abierto = mbAbiertos[mb.id]
        return (
          <div key={mb.id} className={`microbloque ${done ? 'done' : ''}`}>
            <div className="microbloque-header" onClick={() => onToggleMb(mb.id)}>
              <span className="microbloque-title">{mb.titulo}</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className={`microbloque-badge ${done ? 'done' : ''}`}>
                  {done ? '✓ leído' : `${i + 1}/${totalMb}`}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{abierto ? '▲' : '▼'}</span>
              </div>
            </div>

            {abierto && (
              <div className="microbloque-body">
                <ul className="teoria-list">
                  {mb.teoria.map((t, ti) => <li key={ti}>{t}</li>)}
                </ul>
                <pre>{mb.ejemplo}</pre>
                {mb.notasCatedra && (
                  <div className="nota-catedra">
                    <strong>Nota de la cátedra: </strong>{mb.notasCatedra}
                  </div>
                )}
                <div className="btn-row" style={{ marginTop: '1rem' }}>
                  <button
                    className={`btn ${done ? 'btn-done' : 'btn-primary'}`}
                    onClick={() => onMarcarMb(skill.id, mb.id)}
                  >
                    {done
                      ? '✓ Marcado como leído'
                      : (i < totalMb - 1 ? 'Leído — siguiente ▾' : 'Marcar como leído')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      <MiniTest
        preguntas={skill.miniTest}
        resultados={Object.fromEntries(
          Object.entries(mtResults).map(([k, v]) => {
            const preg = skill.miniTest.find(p => p.id === k)
            if (!preg) return [k, undefined]
            return [k, { elegida: v ? preg.correcta : -1, correcta: v }]
          }).filter(([, v]) => v !== undefined)
        )}
        onAnswer={(pregId, correcta) => onRespuestaMiniTest(skill.id, pregId, correcta)}
      />

      {/* CTA: pasar a la práctica */}
      <div className={`practica-cta ${teoriaCompleta ? 'ready' : ''}`}>
        {totalMb === 0 ? (
          <div className="practica-cta-sub">Este tema todavía no tiene teoría cargada.</div>
        ) : teoriaCompleta ? (
          <>
            <div className="practica-cta-title">🎉 ¡Teoría completa!</div>
            <div className="practica-cta-sub">
              Leíste los {totalMb} microbloques{mtRespondidas === skill.miniTest.length ? ' y respondiste el mini-test' : ''}.
              {numEjercicios > 0
                ? ` Ahora afianzá lo aprendido con ${numEjercicios} ejercicio${numEjercicios === 1 ? '' : 's'}.`
                : ' Todavía no hay ejercicios cargados para este tema.'}
            </div>
          </>
        ) : (
          <div className="practica-cta-sub">
            Te {totalMb - leidos === 1 ? 'queda' : 'quedan'} {totalMb - leidos} microbloque{totalMb - leidos === 1 ? '' : 's'} por leer.
            Igual podés practicar cuando quieras.
          </div>
        )}
        <button
          className="btn btn-primary practica-cta-btn"
          onClick={() => onGoToPractice(skill.id)}
        >
          💻 Practicar ejercicios →
        </button>
      </div>

      {/* Navegación entre temas */}
      <div className="tema-nav">
        {prevSkill ? (
          <button className="btn btn-secondary" onClick={() => onSelectSkill(prevSkill.id)}>
            ← {prevSkill.icono} {prevSkill.titulo}
          </button>
        ) : <span />}
        {nextSkill && (
          <button className="btn btn-secondary" onClick={() => onSelectSkill(nextSkill.id)}>
            {nextSkill.icono} {nextSkill.titulo} →
          </button>
        )}
      </div>
    </div>
  )
}

// ─── EJERCICIOS VIEW ────────────────────────────────────────────────────────
function EjerciciosView({ skill, allSkills, ejercicios, progress, onDone, onSelectSkill, onGoToTheory }) {
  const ejDeSkill = ejercicios.filter(e => e.subhabilidadId === skill.id)
  const ejDone = new Set(progress[skill.id]?.ejerciciosDone || [])
  const hechos = ejDeSkill.filter(e => ejDone.has(e.id)).length

  return (
    <div>
      <div className="skill-tabs">
        {allSkills.map(s => {
          const ejs = ejercicios.filter(e => e.subhabilidadId === s.id)
          const done = ejs.filter(e => (progress[s.id]?.ejerciciosDone || []).includes(e.id)).length
          return (
            <button
              key={s.id}
              className={`skill-tab ${s.id === skill.id ? 'active' : ''}`}
              onClick={() => onSelectSkill(s.id)}
              style={s.id === skill.id ? { borderColor: s.color, color: s.color } : {}}
            >
              {s.icono} {s.titulo.split(' — ')[0]}
              <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                {done}/{ejs.length}
              </span>
            </button>
          )
        })}
      </div>

      <div className="section-title">💻 Ejercicios — {skill.titulo}</div>
      <div className="section-subtitle">
        Basados en la Práctica 4, 5 y 6 de la cátedra · {hechos}/{ejDeSkill.length} resueltos
      </div>

      <div className="btn-row" style={{ marginBottom: '1.25rem' }}>
        <button className="btn btn-secondary" onClick={() => onGoToTheory(skill.id)}>
          ← 📖 Volver a la teoría
        </button>
      </div>

      {ejDeSkill.length === 0 ? (
        <div className="card"><p style={{ color: 'var(--text-muted)' }}>No hay ejercicios para esta sección todavía.</p></div>
      ) : (
        ejDeSkill.map(ej => (
          <Ejercicio
            key={ej.id}
            ejercicio={ej}
            isDone={ejDone.has(ej.id)}
            onDone={onDone}
          />
        ))
      )}
    </div>
  )
}

// ─── PROGRESO VIEW ──────────────────────────────────────────────────────────
function ProgresoView({ progress }) {
  const pctTotal = calcularProgreso(progress)

  return (
    <div>
      <div className="section-title">📊 Mi progreso</div>
      <div className="section-subtitle">Hacia el parcial del 13 de junio</div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: 600 }}>Progreso total</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '1.2rem' }}>{pctTotal}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${pctTotal}%` }} />
        </div>
      </div>

      <div className="progress-skills">
        {SUBHABILIDADES.map(sk => {
          const p = progress[sk.id] || {}
          const ejsSkill = EJERCICIOS.filter(e => e.subhabilidadId === sk.id)
          const mbDone = (p.microbloquesDone || []).length
          const mtDone = Object.values(p.miniTestResults || {}).filter(Boolean).length
          const ejDone = (p.ejerciciosDone || []).length
          const total = sk.microbloques.length + sk.miniTest.length + ejsSkill.length
          const done = mbDone + mtDone + ejDone
          const pct = total > 0 ? Math.round((done / total) * 100) : 0

          return (
            <div key={sk.id} className="skill-progress-card">
              <div className="skill-progress-header">
                <span className="skill-progress-title">{sk.icono} {sk.titulo}</span>
                <span className="skill-progress-pct">{pct}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${pct}%`, background: sk.color }} />
              </div>
              <div className="progress-detail">
                <span className="progress-detail-item">Teoría: <span>{mbDone}/{sk.microbloques.length}</span></span>
                <span className="progress-detail-item">Mini-tests: <span>{mtDone}/{sk.miniTest.length}</span></span>
                <span className="progress-detail-item">Ejercicios: <span>{ejDone}/{ejsSkill.length}</span></span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-title" style={{ marginBottom: '0.75rem' }}>Recordá para el parcial</div>
        <ul className="teoria-list">
          <li>El while de búsqueda: SIEMPRE (pos &lt;= dL) antes que la condición de valor</li>
          <li>insertar en arreglo: for DOWNTO (derecha a izquierda)</li>
          <li>eliminar en arreglo: for TO (izquierda a derecha)</li>
          <li>dispose(p) libera memoria. p := nil solo pierde la referencia</li>
          <li>sizeof(puntero) = siempre 4. sizeof(puntero^) = tamaño del tipo apuntado</li>
          <li>Recorrer lista: usar auxiliar (aux := pI), NUNCA avanzar con pri</li>
          <li>Eliminar de lista: usar actual y ant. Casos: no está / es primero / no es primero</li>
          <li>Insertar ordenado: casos 3 y 4 se unifican (en caso 4, actual = nil = correcto)</li>
          <li>La tabla de bytes cambia entre enunciados — SIEMPRE leer la tabla que da el problema</li>
        </ul>
      </div>
    </div>
  )
}
