import { BarChart3, BookOpen } from 'lucide-react'
// @ts-expect-error — data module is plain JS (allowJs)
import { SUBHABILIDADES } from '@/data/curriculum.js'
import { skillProgress, calcularProgreso } from '@/lib/progress'
import { getSkillMeta } from '@/lib/skillMeta'
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid'
import { ProgressBar } from '@/components/ui/progress-bar'

interface ProgresoViewProps {
  progress: Record<string, any>
  onSelectSkill: (id: string) => void
}

const RECORDATORIOS = [
  'El while de búsqueda: SIEMPRE (pos <= dL) antes que la condición de valor.',
  'insertar en arreglo: for DOWNTO · eliminar en arreglo: for TO.',
  'dispose(p) libera memoria. p := nil solo pierde la referencia.',
  'sizeof(puntero) = siempre 4. sizeof(puntero^) = tamaño del tipo apuntado.',
  'Recorrer lista: usar auxiliar (aux := pI), nunca avanzar con pri.',
  'Insertar ordenado: casos 3 y 4 se unifican (en caso 4, actual = nil).',
  'La tabla de bytes cambia entre enunciados — siempre leer la del problema.',
]

export function ProgresoView({ progress, onSelectSkill }: ProgresoViewProps) {
  const pctTotal = calcularProgreso(progress)

  const items: BentoItem[] = SUBHABILIDADES.map((s: any) => {
    const sp = skillProgress(s.id, progress)
    const meta = getSkillMeta(s.id)
    const Icon = meta.Icon
    return {
      title: s.titulo,
      description: s.descripcion,
      icon: <Icon className="h-4 w-4" />,
      meta: `${sp.pct}%`,
      accent: meta.accent,
      onClick: () => onSelectSkill(s.id),
      cta: 'Abrir →',
      footer: <ProgressBar value={sp.pct} accent={meta.accent} label={`Progreso ${s.titulo}`} />,
      tags: [
        `Teoría ${sp.mbDone}/${sp.mbTotal}`,
        `Tests ${sp.mtDone}/${sp.mtTotal}`,
        `Ejerc ${sp.ejDone}/${sp.ejTotal}`,
      ],
    }
  })

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
          Mi progreso
        </h1>
        <p className="text-sm text-muted-foreground">Hacia el parcial del 13 de junio</p>
      </div>

      {/* Resumen total */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <BarChart3 className="h-4 w-4 text-primary" /> Progreso total
          </span>
          <span className="font-mono text-2xl font-bold text-primary tabular-nums">{pctTotal}%</span>
        </div>
        <ProgressBar value={pctTotal} accent="var(--primary)" label="Progreso total" />
      </section>

      <BentoGrid items={items} />

      {/* Recordatorios */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <BookOpen className="h-4 w-4 text-teal" /> Recordá para el parcial
        </div>
        <ul className="space-y-2">
          {RECORDATORIOS.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
              {r}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
