import { Calendar, Trophy, type LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'
import { SUBHABILIDADES } from '@/data/curriculum.js'
import { PLAN_ESTUDIO } from '@/data/plan.js'
import { getSkillMeta } from '@/lib/skillMeta'
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid'

interface RoadmapViewProps {
  onSelectSkill: (id: string) => void
}

export function RoadmapView({ onSelectSkill }: RoadmapViewProps) {
  const hoy = new Date().toISOString().split('T')[0]

  const items: BentoItem[] = PLAN_ESTUDIO.map((dia: any) => {
    const esHoy = dia.fecha === hoy
    const esPasado = dia.fecha < hoy
    const sk = dia.subhabilidadId
      ? SUBHABILIDADES.find((s: any) => s.id === dia.subhabilidadId)
      : null
    const meta = sk ? getSkillMeta(sk.id) : null

    let Icon: ComponentType<LucideProps> = Calendar
    let accent = 'var(--brand-teal)'
    if (dia.esParcial) {
      Icon = Trophy
      accent = 'var(--primary)'
    } else if (meta) {
      Icon = meta.Icon
      accent = meta.accent
    }

    const status = dia.esParcial
      ? 'Meta'
      : esHoy
      ? 'Hoy'
      : esPasado
      ? 'Visto'
      : 'Próximo'

    return {
      title: dia.esParcial
        ? 'Parcial CADP'
        : sk
        ? sk.titulo
        : dia.descanso
        ? 'Descanso'
        : dia.temas[0],
      description: dia.objetivo,
      icon: <Icon className="h-4 w-4" />,
      meta: dia.dia,
      accent,
      status,
      statusTone: dia.esParcial ? 'warning' : esHoy ? 'teal' : esPasado ? 'success' : 'default',
      tags: dia.temas?.slice(0, 2),
      colSpan: dia.esParcial || esHoy ? 2 : 1,
      hasPersistentHover: esHoy || dia.esParcial,
      cta: sk ? 'Abrir tema →' : undefined,
      onClick: sk ? () => onSelectSkill(sk.id) : undefined,
    }
  })

  return (
    <div className="animate-fade-up space-y-4 motion-reduce:animate-none">
      <div>
        <h1 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
          Plan de estudio
        </h1>
        <p className="text-sm text-muted-foreground">
          29 de mayo → 13 de junio · ruta diaria hacia el segundo parcial
        </p>
      </div>
      <BentoGrid items={items} />
    </div>
  )
}
