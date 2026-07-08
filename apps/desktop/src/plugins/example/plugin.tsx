/**
 * Example plugin — the authoring + publishing reference. A folder under
 * `src/plugins/` with a `plugin.tsx` that default-exports a `HermesPlugin` is
 * all it takes; `discoverBundledPlugins()` finds and registers it (no import,
 * no registry edit). Delete this folder and the statusbar item is gone.
 *
 * The ONLY import surface is `@hermes/plugin-sdk` (lint-enforced) — the
 * vscode-module model. Everything a plugin needs arrives through it: readonly
 * app state (`host.state` + `useValue`), safe actions (`host.notify`,
 * `haptic`), the gateway door (`host.request`), and the design language
 * (`Tip`, `cn`, …). A runtime-fetched published plugin gets this exact same
 * object injected, so this file IS the publishing shape.
 */

import { cn, haptic, type HermesPlugin, host, Tip, useValue } from '@hermes/plugin-sdk'
import { useState } from 'react'

function ClickCounter() {
  const [count, setCount] = useState(0)
  // Readonly app state, reactively — no store imports.
  const gateway = useValue(host.state.gateway)

  return (
    <Tip label={`Example plugin — click to count (gateway: ${gateway})`}>
      <button
        className={cn(
          'inline-flex h-full items-center gap-1 rounded-none px-1.5 text-[0.6875rem] tabular-nums transition-colors',
          'text-(--ui-text-tertiary) hover:bg-(--chrome-action-hover) hover:text-foreground',
          count > 0 && 'text-foreground'
        )}
        onClick={() => {
          haptic('tap')
          setCount(n => n + 1)

          if ((count + 1) % 10 === 0) {
            host.notify({ kind: 'success', message: `Example plugin: ${count + 1} clicks!` })
          }
        }}
        type="button"
      >
        <span aria-hidden>◉</span>
        <span>{count === 0 ? 'click me' : `clicked ${count}×`}</span>
      </button>
    </Tip>
  )
}

const plugin: HermesPlugin = {
  id: 'example',
  name: 'Example Plugin',
  register(ctx) {
    // Provenance (source: 'plugin:example') and the namespaced registry id
    // (example:counter) are stamped by ctx — authors write plain contributions.
    ctx.register({
      id: 'counter',
      area: 'statusBar.right',
      order: 100,
      render: () => <ClickCounter />
    })
  }
}

export default plugin
