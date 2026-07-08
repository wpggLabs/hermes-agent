/**
 * The plugin authoring contract. A plugin is a file that default-exports a
 * `HermesPlugin`; it never touches the registry directly — it receives a
 * scoped `PluginContext` whose `register` auto-tags provenance
 * (`source: 'plugin:<id>'`) and namespaces the contribution id
 * (`<id>:<localId>`), so authors write plain contributions and collisions
 * between plugins are impossible.
 *
 * Bundled plugins live in `src/plugins/<name>/plugin.tsx` and are discovered
 * by `discoverBundledPlugins()` (contrib/plugins.ts) — no import, no registry
 * edit. Runtime-fetched third-party plugins will drive the SAME contract
 * through the plugin host loader (next phase); this is that seam.
 */

import { registry } from './registry'
import type { Contribution } from './types'

/** A contribution as a plugin author writes it — provenance + id scoping are
 *  the host's job, so those fields are off-limits here. */
export type PluginContribution = Omit<Contribution, 'source' | 'id'> & { id: string }

export interface PluginContext {
  /** The resolved plugin source tag, e.g. `'plugin:cost-meter'`. */
  readonly source: string
  /** Register one contribution (id namespaced, source stamped). */
  register: (c: PluginContribution) => () => void
  /** Register several at once; the returned disposer removes all of them. */
  registerMany: (cs: PluginContribution[]) => () => void
}

export interface HermesPlugin {
  /** Stable slug — becomes the `plugin:<id>` source and the id namespace. */
  id: string
  /** Human name for settings / about UI. */
  name?: string
  /** Called once at load; wire contributions through `ctx`. */
  register: (ctx: PluginContext) => void
}

/** Build the scoped context handed to a plugin's `register`. */
export function createPluginContext(pluginId: string): PluginContext {
  const source = `plugin:${pluginId}`
  const scope = (c: PluginContribution): Contribution => ({ ...c, id: `${pluginId}:${c.id}`, source })

  return {
    source,
    register: c => registry.register(scope(c)),
    registerMany: cs => registry.registerMany(cs.map(scope))
  }
}
