import type { KeyboardEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface BentoItem {
  title: string
  description: string
  icon: ReactNode
  status?: string
  statusTone?: 'default' | 'success' | 'warning' | 'danger' | 'teal'
  tags?: string[]
  meta?: string
  cta?: string
  colSpan?: number
  hasPersistentHover?: boolean
  /** Color de acento de la tarjeta (variable HSL de la marca, ej: 'var(--brand-teal)'). */
  accent?: string
  /** Contenido extra (barra de progreso, etc.) que se inserta antes de los tags. */
  footer?: ReactNode
  onClick?: () => void
}

interface BentoGridProps {
  items: BentoItem[]
  className?: string
}

const statusToneClass: Record<NonNullable<BentoItem['statusTone']>, string> = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-success/15 text-success',
  warning: 'bg-primary/15 text-primary',
  danger: 'bg-destructive/15 text-destructive',
  teal: 'bg-teal/15 text-teal',
}

function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-3 md:grid-cols-3', className)}>
      {items.map((item, index) => {
        const interactive = typeof item.onClick === 'function'
        const accent = item.accent ?? 'var(--primary)'

        const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
          if (!interactive) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            item.onClick?.()
          }
        }

        return (
          <div
            key={index}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            onClick={item.onClick}
            onKeyDown={handleKey}
            style={{ ['--card-accent' as string]: `hsl(${accent})` }}
            className={cn(
              'group relative overflow-hidden rounded-xl border border-border bg-card p-4',
              'transition-all duration-300 ease-out will-change-transform',
              'motion-reduce:transition-none',
              'hover:-translate-y-0.5 hover:border-[color:var(--card-accent)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]',
              'motion-reduce:hover:translate-y-0',
              interactive &&
                'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--card-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              item.colSpan === 2 ? 'md:col-span-2' : 'col-span-1',
              item.hasPersistentHover && '-translate-y-0.5 border-[color:var(--card-accent)]',
            )}
          >
            {/* Patrón de puntos sutil al hover */}
            <div
              className={cn(
                'pointer-events-none absolute inset-0 transition-opacity duration-300',
                item.hasPersistentHover ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
              )}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[length:6px_6px]" />
            </div>

            {/* Halo de acento en la esquina */}
            <div
              aria-hidden
              className={cn(
                'pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition-opacity duration-300',
                item.hasPersistentHover ? 'opacity-25' : 'opacity-0 group-hover:opacity-20',
              )}
              style={{ background: 'var(--card-accent)' }}
            />

            <div className="relative flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-300"
                  style={{ backgroundColor: 'color-mix(in oklab, var(--card-accent) 16%, transparent)', color: 'var(--card-accent)' }}
                >
                  {item.icon}
                </div>
                {item.status && (
                  <span
                    className={cn(
                      'rounded-lg px-2 py-1 font-mono text-[0.7rem] font-medium backdrop-blur-sm transition-colors duration-300',
                      statusToneClass[item.statusTone ?? 'default'],
                    )}
                  >
                    {item.status}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <h3 className="font-sans text-[15px] font-semibold leading-tight tracking-tight text-foreground">
                  {item.title}
                  {item.meta && (
                    <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                      {item.meta}
                    </span>
                  )}
                </h3>
                <p className="text-sm leading-snug text-muted-foreground">{item.description}</p>
              </div>

              {item.footer}

              {(item.tags?.length || item.cta) && (
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[0.7rem] text-muted-foreground">
                    {item.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-muted px-2 py-1 transition-colors duration-200 group-hover:bg-secondary"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  {item.cta && (
                    <span className="font-mono text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      {item.cta}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { BentoGrid }
