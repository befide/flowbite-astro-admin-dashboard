import type { TreeNode } from "@lib/content.tree"
import type { TaxonomyItemDto } from "@domain/taxonomy/index.ts"

export const treeSectionsConfigMap = (key: string) => {
  if (key === "domainTaxonomy" || key === "genericTaxonomy") {
    return [
      {
        label: "Term",
        format: (d: TreeNode<TaxonomyItemDto>) => d.data.term,
      },
      {
        label: "defintion",
        format: (d: TreeNode<TaxonomyItemDto>) => d.data.definition,
      },
    ]
  } else {
    return []
  }
}
