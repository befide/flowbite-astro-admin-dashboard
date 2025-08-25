/* eslint-disable @typescript-eslint/no-explicit-any */
import { TreeTable } from "@components/dc-explorer/dc/dc-tree-data-table-class"
import { charts } from "."

export const treeDataTableTileId = (collection: string, dimension: string) => {
  return "dc-explorer__tile--" + collection + "-" + dimension
}
export const treeDataTableId = (collection: string, dimension: string) => {
  return "dc-explorer__tree-table--" + collection + "-" + dimension
}

export function createTreeDataTableChart(
  collection: string,
  dimension: string,
  tableHeaderConfig: any,
  cfDimension: any
) {
  // const tileElementIdSelector = "#" + treeDataTableTileId(collection, dimension)
  const chartElementIdSelector = "#" + treeDataTableId(collection, dimension)

  const treeDataTableChart = new TreeTable(chartElementIdSelector, cfDimension)
  treeDataTableChart.columns(tableHeaderConfig)

  charts.set(treeDataTableId(collection, dimension), treeDataTableChart)

  treeDataTableChart.render()

  return treeDataTableChart

  // console.log({ treeDataTableChart, cfDimension })

  // if (treeDataTableChart && cfDimension) {
  //   treeDataTableChart
  //     // .allEntries(cfDimension.filter().bottom(Infinity))
  //     // .dimension(cfDimension)
  //     // .showSections(false)

  //     .columns(tableHeaderConfig)
  // }
}
