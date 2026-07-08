/**
 * Layout edit mode — the shared toggle for the tree renderer's FancyZones-style
 * rearrangement (see tree/renderer.tsx). The toggle hotkey is a `keybinds`
 * contribution (`layout.editMode`, default ⌘⇧\ — the sibling of ⌘\ = flip
 * panes), so it's rebindable and collision-checked like every other action.
 * This hook only owns Escape-to-exit.
 */

import { atom } from 'nanostores'
import { useEffect } from 'react'

export const $layoutEditMode = atom(false)

export function toggleLayoutEditMode() {
  $layoutEditMode.set(!$layoutEditMode.get())
}

/** Escape exits edit mode. Registered once by the layout root. */
export function useLayoutEditHotkey(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && $layoutEditMode.get()) {
        e.preventDefault()
        $layoutEditMode.set(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])
}
