import type {
  FacilitySchema,
  TaxonomyItemSchema,
  NestableDomainObjectSchema,
  OrganizationSchema,
  FacilityDto,
} from "@lib/common.d.ts"

type TreeSchema = OrganizationSchema | FacilitySchema | FacilityDto | TaxonomyItemSchema

export type TreeNode<Datum extends TreeSchema> = {
  id: string
  parent__id: string | null
  depth: number
  isSelected: boolean
  childIndex: number | null
  children: TreeNode<Datum>[]
  data: Datum
}

export function getRoots<Datum extends TreeSchema>(
  items: Array<Datum>, //, id: IdOperator =( p => p.id), parentId = p => p.parentId
): TreeNode<Datum>[] {
  const roots: TreeNode<Datum>[] = []

  const flatTreeNodes: TreeNode<Datum>[] = items.map((item) => ({
    id: item.id,
    parent__id: item.parent__id,
    isSelected: true,
    data: item,
    childIndex: null,
    children: [],
    depth: 0,
  }))

  const flatTreeNodeMap: {
    [key: string]: TreeNode<Datum>
  } = {}

  flatTreeNodes.forEach((node) => {
    flatTreeNodeMap[node.id] = { ...node, children: [] }
  })

  flatTreeNodes.forEach((item) => {
    if (item.parent__id === null) {
      if (flatTreeNodeMap[item.id] !== undefined) {
        roots.push(flatTreeNodeMap[item.id]!)
      }
    } else {
      const parent = flatTreeNodeMap[item.parent__id]
      if (parent) {
        flatTreeNodeMap[item.id]!.depth = parent.depth + 1
        flatTreeNodeMap[item.id]!.childIndex = parent.children.length
        parent.children.push(flatTreeNodeMap[item.id]!)
      }
    }
  })

  return roots
}

export function flattenTreeNode<Datum extends NestableDomainObjectSchema>(
  node: TreeNode<Datum>,
): TreeNode<Datum>[] {
  return node.children.length > 0 ? [node, ...node.children.flatMap(flattenTreeNode)] : [node]
}

export function flattenTreeNodes<Datum extends NestableDomainObjectSchema>(
  nodes: TreeNode<Datum>[],
) {
  return nodes.flatMap(flattenTreeNode)
}
