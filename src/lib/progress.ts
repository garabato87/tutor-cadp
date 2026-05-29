import { SUBHABILIDADES, EJERCICIOS } from '@/data/curriculum.js'

export interface SkillProgress {
  mbDone: number
  mbTotal: number
  mtDone: number
  mtTotal: number
  ejDone: number
  ejTotal: number
  done: number
  total: number
  pct: number
}

type ProgressMap = Record<string, any>

export function skillProgress(skillId: string, progress: ProgressMap): SkillProgress {
  const sk = SUBHABILIDADES.find((s: any) => s.id === skillId)
  const p = progress?.[skillId] || {}
  const ejs = EJERCICIOS.filter((e: any) => e.subhabilidadId === skillId)

  const mbTotal = sk ? sk.microbloques.length : 0
  const mtTotal = sk ? sk.miniTest.length : 0
  const ejTotal = ejs.length

  const mbDone = (p.microbloquesDone || []).length
  const mtDone = Object.values(p.miniTestResults || {}).filter(Boolean).length
  const ejDone = (p.ejerciciosDone || []).length

  const total = mbTotal + mtTotal + ejTotal
  const done = mbDone + mtDone + ejDone
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return { mbDone, mbTotal, mtDone, mtTotal, ejDone, ejTotal, done, total, pct }
}

export function calcularProgreso(progress: ProgressMap): number {
  let total = 0
  let done = 0
  for (const sk of SUBHABILIDADES) {
    const sp = skillProgress(sk.id, progress)
    total += sp.total
    done += sp.done
  }
  return total > 0 ? Math.round((done / total) * 100) : 0
}
