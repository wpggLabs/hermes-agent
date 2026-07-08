import { useSyncExternalStore } from 'react'

import { registry } from '../registry'
import type { Contribution } from '../types'

/** Subscribe to the resolved contributions for an area. */
export function useContributions(area: string): readonly Contribution[] {
  return useSyncExternalStore(
    registry.subscribe,
    () => registry.getArea(area),
    () => registry.getArea(area)
  )
}
