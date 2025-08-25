import {
  careerLevels,
  disciplinaryProfessions,
  genders,
} from "@domain/organizations/const"
import type { TreeNode } from "@lib/content.tree"
import type { FacilityDto } from "@domain/facilities/facility"
import { numberFormat, oneLineFormat } from "./config"
import type { TaxonomyItemDto } from "@domain/taxonomy/taxonomyItem.ts"
import fastCartesian from "fast-cartesian"
import { OrganizationDto } from "@domain/"
function getValue(obj: any, path: string) {
  const pathParts = path.split(".")
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i]! in obj) obj = obj[pathParts[i]!]
    else return
  }
  return obj
}

const product = fastCartesian([
  [...careerLevels],
  [...disciplinaryProfessions],
  [...genders],
])

export const treeTableConfigMap = (key: string) => {
  if (key === "domainTaxonomy" || key === "genericTaxonomy") {
    return [
      {
        label: "Term",
        format: (d: TreeNode<TaxonomyItemDto>) =>
          `${oneLineFormat(d.data.term)}`,
      },
      {
        label: "defintion",
        format: (d: TreeNode<TaxonomyItemDto>) =>
          `${oneLineFormat(d.data.definition)}`,
      },
    ]
  } else if (key === "community") {
    return [
      {
        label: "Label",
        format: (d: TreeNode<OrganizationDto>) =>
          `<div>${oneLineFormat(d.data.label__short)}</div>`,
      },
      {
        label: "full",
        format: (d: TreeNode<OrganizationDto>) =>
          `<div>${oneLineFormat(d.data.label__fullName)}</div>`,
        width: "flex: 1 0 30ch",
      },
      {
        label: "total",
        className: "tree-node__value",
        width: "flex: 1 0 10ch",
        format: (d: TreeNode<OrganizationDto>) =>
          d.data.uniquePeopleCountRecursiveSum?.total,
      },
      {
        label: "members",
        className: "tree-node__value",
        width: "flex: 1 0 10ch",
        format: (d: TreeNode<OrganizationDto>) =>
          product.filter((p) =>
            getValue(d.data.uniquePeopleCount, p.join("."))
          ),
      },
    ]
  } else if (key === "facilities") {
    return [
      {
        label: "Label",
        format: (d: TreeNode<FacilityDto>) =>
          `<div class='bold tree-node__cell--label'>${d.data.label}</div>${
            d.data.tagLine
              ? "<div class='tree-node__cell--tag-line'>" +
                d.data.tagLine +
                "</div>"
              : ""
          }</div>`,
      },
      {
        label: "Type",
        format: (d: TreeNode<FacilityDto>) => d.data.instanceOf__term,
        width: "flex: 1 0 30ch",
      },
      {
        label: "Operation Start",
        format: (d: TreeNode<FacilityDto>) =>
          numberFormat(d.data.operation_startYear),
        width: "flex: 0 0 10ch",
      },
      {
        label: "Operation End",
        format: (d: TreeNode<FacilityDto>) => {
          return numberFormat(d.data.operation_endYear)
        },
        width: "flex: 0 0 10ch",
      },
    ]
  } else {
    return []
  }
}
