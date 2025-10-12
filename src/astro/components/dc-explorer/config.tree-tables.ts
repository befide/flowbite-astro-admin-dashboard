import { careerLevels, disciplinaryProfessions, genders } from "@domain/organizations/const"
import type { TreeNode } from "@lib/content.tree"
import type { FacilityDto, TaxonomyItemDto, OrganizationDto } from "@lib/common.d"
import { numberFormat, oneLineFormat } from "./config"
import fastCartesian from "fast-cartesian"
function getValue(obj: any, path: string) {
  const pathParts = path.split(".")
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i]! in obj) obj = obj[pathParts[i]!]
    else return
  }
  return obj
}

const product = fastCartesian([[...careerLevels], [...disciplinaryProfessions], [...genders]])

export const treeTableConfigMap = (key: string) => {
  if (key === "domainTaxonomy" || key === "genericTaxonomy") {
    return [
      {
        label: "Term",
        format: (d: TreeNode<TaxonomyItemDto>) => `${oneLineFormat(d.data.term)}`,
      },
      {
        label: "defintion",
        format: (d: TreeNode<TaxonomyItemDto>) => `${oneLineFormat(d.data.definition)}`,
      },
    ]
  } else if (key === "community") {
    return [
      {
        label: "Label",
        width: "flex: 0 0 50ch",
        format: (d: TreeNode<OrganizationDto>) =>
          `<div>${oneLineFormat(d.data.label__short)}</div><div>${oneLineFormat(d.data.label__fullName)}</div>`,
      },
      {
        label: "total",
        className: "tree-node__value number",
        width: "flex: 1 0 10ch",
        format: (d: TreeNode<OrganizationDto>) => d.data.uniquePeopleCountRecursiveSum?.total,
      },
      {
        label: "members",
        className: "tree-node__value",
        width: "flex: 1 0 10ch",
        format: (d: TreeNode<OrganizationDto>) =>
          product.filter((p) => getValue(d.data.uniquePeopleCount, p.join("."))),
      },
    ]
  } else if (key === "facilities") {
    return [
      {
        label: "Label",
        format: (d: TreeNode<FacilityDto>) =>
          `<div class='font-bold tree-node__cell--label'>${d.data.label}</div>${
            d.data.tagLine && false ? "<div class='one-line'>" + d.data.tagLine + "</div>" : ""
          }</div>`,
        width: "flex: 0 0 50ch",
      },
      {
        label: "Type",
        format: (d: TreeNode<FacilityDto>) => d.data.instanceOf__term,
        width: "flex: 0 0 30ch",
      },
      {
        label: "Host",
        format: (d: TreeNode<FacilityDto>) => d.data.host__label_short,
        width: "flex: 0 0 30ch",
      },
      {
        label: "user facility",
        format: (d: TreeNode<FacilityDto>) => d.data.isUserFacility,
        width: "flex: 0 0 30ch",
      },
      {
        label: "Life cycle",
        format: (d: TreeNode<FacilityDto>) => d.data.currentStatus__term,
        width: "flex: 0 0 30ch",
      },
      {
        label: "Operation Start",
        format: (d: TreeNode<FacilityDto>) => numberFormat(d.data.operation_startYear),
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
