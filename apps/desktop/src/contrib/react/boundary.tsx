import type { ReactNode } from 'react'

import { ErrorBoundary } from '@/components/error-boundary'
import { Tip } from '@/components/ui/tooltip'

interface ContribBoundaryProps {
  children: ReactNode
  /** Contribution key, shown in the fallback + console tag. */
  id: string
  /** `chip` = inline bar item (tiny fallback); `pane` = zone body. */
  variant?: 'chip' | 'pane'
}

/**
 * The blast wall between a contribution's `render()` and the app. Plugin
 * code throwing during render (bad import, undefined component, logic bug)
 * degrades to a small inline error in ITS slot — the surrounding bar/zone,
 * other plugins, and the app keep working. Every surface that mounts
 * contribution renders wraps them in this.
 */
export function ContribBoundary({ children, id, variant = 'pane' }: ContribBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) =>
        variant === 'chip' ? (
          <Tip label={`${id}: ${error.message}`}>
            <button
              className="rounded px-1.5 font-mono text-[10px] text-(--ui-danger,#f87171) hover:bg-(--chrome-action-hover)"
              onClick={reset}
              type="button"
            >
              ⚠ {id}
            </button>
          </Tip>
        ) : (
          <div className="grid h-full place-items-center p-4">
            <div className="max-w-[26rem] space-y-2 text-center font-mono text-[11px]">
              <div className="text-(--ui-danger,#f87171)">“{id}” crashed while rendering</div>
              <div className="break-words text-(--ui-text-quaternary)">{error.message}</div>
              <button
                className="rounded-md border border-(--ui-stroke-secondary) px-2 py-1 text-(--ui-text-secondary) hover:bg-(--chrome-action-hover)"
                onClick={reset}
                type="button"
              >
                retry
              </button>
            </div>
          </div>
        )
      }
      label={`contrib:${id}`}
    >
      {children}
    </ErrorBoundary>
  )
}
