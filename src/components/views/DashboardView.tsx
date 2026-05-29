import { GraduationCap, Clock, TrendingUp, ArrowRight, AlertTriangle } from 'lucide-react'
// @ts-expect-error — data module is plain JS (allowJs)
import { SUBHABILIDADES } from '@/data/curriculum.js'
import { skillProgress, calcularProgreso } from '@/lib/progress'
import { getSkillMeta } from '@/lib/skillMeta'
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid'
import { ProgressBar } from '@/components/ui/progress-bar'

interface DashboardViewProps {
  progress: Record<string, any>
  countdown: string | null
  onSelectSkill: (id: string) => void
  onGoToPractice: (id: string) => void
  onOpenProgreso: () => void
}

export function DashboardView({
  progress,
  countdown,
  onSelectSkill,
  onGoToPractice,
  onOpenProgreso,
}: DashboardViewProps) {
  const pctTotal = calcularProgreso(progress)
  const proximo =
    SUBHABILIDADES.find((s: any) => skillProgress(s.id, progress).pct < 100) || SUBHABILIDADES[0]
  const proximoMeta = getSkillMeta(proximo.id)

  const items: BentoItem[] = SUBHABILIDADES.map((s: any) => {
    const sp = skillProgress(s.id, progress)
    const meta = getSkillMeta(s.id)
    const Icon = meta.Icon
    const completo = sp.pct === 100
    return {
      title: s.titulo,
      description: s.descripcion,
      icon: <Icon className="h-4 w-4" />,
      meta: `${sp.pct}%`,
      accent: meta.accent,
      status: completo ? 'Completo' : sp.pct === 0 ? 'Sin empezar' : 'En curso',
      statusTone: completo ? 'success' : sp.pct === 0 ? 'default' : 'warning',
      cta: 'Estudiar →',
      onClick: () => onSelectSkill(s.id),
      footer: <ProgressBar value={sp.pct} accent={meta.accent} label={`Progreso ${s.titulo}`} />,
      tags: [`Teoría ${sp.mbDone}/${sp.mbTotal}`, `Ejerc ${sp.ejDone}/${sp.ejTotal}`],
    }
  })

  return (
    <div className="animate-fade-up space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              Tutor CADP · Pascal — UNLP
            </span>
            <h1 className="max-w-xl font-sans text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              Tu camino al{' '}
              <span className="text-primary">segundo parcial</span>
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Arreglos, punteros y listas enlazadas. Teoría en microbloques, mini-tests y práctica
              con la notación exacta de la cátedra.
            </p>
          </div>

          {countdown && (
            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-muted/60 px-4 py-3">
              <Clock className="h-5 w-5 text-teal" />
              <div>
                <div className="font-mono text-lg font-bold text-foreground">{countdown}</div>
                <div className="text-xs text-muted-foreground">13 de junio · 2do parcial</div>
              </div>
            </div>
          )}
        </div>

        {/* Progreso global */}
        <div className="relative mt-6 rounded-xl border border-border bg-background/40 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <TrendingUp className="h-4 w-4 text-primary" /> Progreso total
            </span>
            <button
              onClick={onOpenProgreso}
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              ver detalle →
            </button>
          </div>
          <div className="flex items-center gap-4">
            <ProgressBar value={pctTotal} accent="var(--primary)" label="Progreso total" />
            <span className="shrink-0 font-mono text-xl font-bold text-primary tabular-nums">
              {pctTotal}%
            </span>
          </div>
        </div>

        {/* CTA continuar */}
        <div className="relative mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onSelectSkill(proximo.id)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-mono text-sm font-bold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {pctTotal === 0 ? 'Empezar a estudiar' : 'Seguir donde quedaste'}
            <ArrowRight className="h-4 w-4" />
          </button>
          <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <proximoMeta.Icon className="h-3.5 w-3.5" style={{ color: `hsl(${proximoMeta.accent})` }} />
            {proximo.titulo}
          </span>
        </div>
      </section>

      {/* Errores clásicos */}
      <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
        <div>
          <div className="font-mono text-xs uppercase tracking-wide text-destructive">
            Errores que pregunta la cátedra
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            El <code className="text-foreground">while</code> de búsqueda: siempre{' '}
            <code className="text-foreground">(pos &lt;= dL)</code> primero ·{' '}
            <code className="text-foreground">dispose(p)</code> libera memoria,{' '}
            <code className="text-foreground">p := nil</code> no · insertar usa{' '}
            <code className="text-foreground">downto</code>, eliminar usa <code className="text-foreground">to</code>.
          </p>
        </div>
      </div>

      {/* Bento de subhabilidades */}
      <div>
        <h2 className="mb-3 font-sans text-lg font-semibold text-foreground">Subhabilidades</h2>
        <BentoGrid items={items} />
      </div>
    </div>
  )
}
