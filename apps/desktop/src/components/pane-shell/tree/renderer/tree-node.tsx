import type { LayoutNode } from '../model'

import { TreeGroup } from './tree-group'
import { TreeSplit } from './tree-split'

/** Dispatch a layout node to its renderer — the split/group recursion point.
 *  `root` marks the tree's top split (side collapse applies only there). */
export function TreeNode({ node, root }: { node: LayoutNode; root?: boolean }) {
  return node.type === 'split' ? <TreeSplit node={node} root={root} /> : <TreeGroup node={node} />
}
