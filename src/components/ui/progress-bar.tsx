import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0..100
  /** Color de relleno (variable HSL, ej: 'var(--brand-teal)'). */
  accent?: string
  className?: string
  label?: string
}

export function ProgressBar({ value, accent = 'var(--primary)', className, label }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn('w-full', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${pct}%`}
      aria-label={label ?? 'Progreso'}
    >
      <div className="h-2 w-full overflow-hidden rounded-full border border-border bg-muted">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${pct}%`, background: `hsl(${accent})` }}
        />
      </div>
    </div>
  )
}
