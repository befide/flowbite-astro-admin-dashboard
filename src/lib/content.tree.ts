import { z } from "astro:content";

export const DomainObjectZodSchema = z.object({
  id: z.string().describe("Unique identifier for this entry."),
});
// export type DomainObjectSchema = z.infer<typeof DomainObjectZodSchema>;
export type DomainObjectSchema = {
  id: string;
  isSelected?: boolean;
};

export const NestableDomainObjectZodSchema = DomainObjectZodSchema.extend({
  parent__id: z
    .string()
    .nullable()
    .describe("Identifier of the parent entry, if any."),
});
export type NestableDomainObjectSchema = DomainObjectSchema & {
  parent__id: string | null;
};

// type IdOperator  = (o: DomainObjectSchema) => string;
// type ParentIdOperator  = (o: NestableDomainObjectSchema) => string;

export interface TreeNode<Datum extends NestableDomainObjectSchema> {
  id: string;
  parent__id: string | null;
  depth: number;
  isSelected: boolean;
  childIndex: number | null;
  children: TreeNode<Datum>[];
  data: Datum;
}

export function getRoots<Datum extends NestableDomainObjectSchema>(
  items: Array<Datum>, //, id: IdOperator =( p => p.id), parentId = p => p.parentId
): TreeNode<Datum>[] {
  const roots: TreeNode<Datum>[] = [];

  const flatTreeNodes: TreeNode<Datum>[] = items.map((item) => ({
    id: item.id,
    parent__id: item.parent__id,
    isSelected: true,
    data: item,
    childIndex: null,
    children: [],
    depth: 0,
  }));

  const flatTreeNodeMap: {
    [key: string]: TreeNode<Datum>;
  } = {};

  flatTreeNodes.forEach((node) => {
    flatTreeNodeMap[node.id] = { ...node, children: [] };
  });

  flatTreeNodes.forEach((item) => {
    if (item.parent__id === null) {
      if (flatTreeNodeMap[item.id] !== undefined) {
        roots.push(flatTreeNodeMap[item.id]!);
      }
    } else {
      const parent = flatTreeNodeMap[item.parent__id];
      if (parent) {
        flatTreeNodeMap[item.id]!.depth = parent.depth + 1;
        flatTreeNodeMap[item.id]!.childIndex = parent.children.length;
        parent.children.push(flatTreeNodeMap[item.id]!);
      }
    }
  });

  return roots;
}

export function flattenTreeNode<Datum extends NestableDomainObjectSchema>(
  node: TreeNode<Datum>,
): TreeNode<Datum>[] {
  return node.children.length > 0
    ? [node, ...node.children.flatMap(flattenTreeNode)]
    : [node];
}

export function flattenTreeNodes<Datum extends NestableDomainObjectSchema>(
  nodes: TreeNode<Datum>[],
) {
  return nodes.flatMap(flattenTreeNode);
}
