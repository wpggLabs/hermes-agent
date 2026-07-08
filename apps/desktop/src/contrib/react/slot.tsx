import { Fragment } from 'react'

import type { Contribution } from '../types'

import { useContributions } from './use-contributions'

export interface SlotProps {
  /** Area id whose contributions render inline, in order. */
  area: string
}

/** Renders a bar area: ordered inline items `[...core, ...plugin]`. */
export function Slot({ area }: SlotProps) {
  const items = useContributions(area)

  if (items.length === 0) {return null}

  return (
    <>
      {items.map((c: Contribution) => (
        <Fragment key={`${c.source ?? 'core'}:${c.id}`}>{c.render?.()}</Fragment>
      ))}
    </>
  )
}
