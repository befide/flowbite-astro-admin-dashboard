/* eslint-disable @typescript-eslint/no-explicit-any */
import { TreeDataSections } from "@components/dc-explorer/dc/dc-tree-data-sections"
import { charts, treeDataTableTileId } from "."

export const treeDataSectionsTileId = (
  collection: string,
  dimension: string
) => {
  return "dc-explorer__tile--" + collection + "-" + dimension
}
export const treeDataSectionsId = (collection: string, dimension: string) => {
  return "dc-explorer__tree-sections--" + collection + "-" + dimension
}

export function createTreeDataSectionsChart(
  collection: string,
  dimension: string,
  tableHeaderConfig: any,
  cfDimension: any
) {
  const tileElementIdSelector = "#" + treeDataTableTileId(collection, dimension)
  const chartElementIdSelector = "#" + treeDataSectionsId(collection, dimension)

  const chart = new TreeDataSections(tileElementIdSelector, cfDimension)

  chart.columns(tableHeaderConfig)

  charts.set(treeDataSectionsId(collection, dimension), chart)

  chart.render()

  return chart

  // console.log({ treeDataTableChart, cfDimension })

  // if (treeDataTableChart && cfDimension) {
  //   treeDataTableChart
  //     // .allEntries(cfDimension.filter().bottom(Infinity))
  //     // .dimension(cfDimension)
  //     // .showSections(false)

  //     .columns(tableHeaderConfig)
  // }
}
