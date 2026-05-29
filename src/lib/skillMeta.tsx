import type { ComponentType } from 'react'
import {
  Boxes,
  Search,
  Locate,
  Link2,
  Workflow,
  type LucideProps,
} from 'lucide-react'

export interface SkillMeta {
  Icon: ComponentType<LucideProps>
  /** Variable HSL de acento de la marca (sin hsl(...)). */
  accent: string
}

/** Mapeo de subhabilidad → icono Lucide + acento (reemplaza los emojis). */
export const SKILL_META: Record<string, SkillMeta> = {
  'arreglos-base': { Icon: Boxes, accent: 'var(--brand-warning)' },
  'arreglos-busquedas': { Icon: Search, accent: 'var(--brand-teal)' },
  punteros: { Icon: Locate, accent: 'var(--brand-grape)' },
  'listas-base': { Icon: Link2, accent: 'var(--brand-success)' },
  'listas-avanzado': { Icon: Workflow, accent: 'var(--brand-danger)' },
}

const FALLBACK: SkillMeta = { Icon: Boxes, accent: 'var(--primary)' }

export function getSkillMeta(id: string): SkillMeta {
  return SKILL_META[id] ?? FALLBACK
}
