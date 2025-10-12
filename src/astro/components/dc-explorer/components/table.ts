/* eslint-disable @typescript-eslint/no-explicit-any */
import { csvFormat, select } from "d3"
import { dataTable } from "dc"
import type { TableConfigEntry } from "../config.tables"
import { ascending, descending } from "d3"

export const tableTileId = (collection: string, dimension: string) => {
  return "dc-explorer__tile--" + collection + "-" + dimension
}
export const tableId = (collection: string, dimension: string) => {
  return "dc-explorer__table--" + collection + "-" + dimension
}

const map = new Map<string, string>()
map.set("number", "1fr")
map.set("icon", "1fr")
map.set("text-short", "2fr")
map.set("text-long", "5fr")

const columnTypeToRatioMap = (className: string) => {
  return map.get(className) || "1fr"
}
const columnWidth = (d: TableConfigEntry) => {
  if (d.width) return d.width

  return "minmax(" + (d.width ? d.width : "10ch") + ", " + columnTypeToRatioMap(d.className) + ")"
}

export function createTableChart(
  collection: string,
  dimension: string,
  tableHeaderConfig: TableConfigEntry[],
  cfDimension: any,
) {
  const tileElementIdSelector = "#" + tableTileId(collection, dimension)
  const chartElementIdSelector = "#" + tableId(collection, dimension)

  // if (!document.getElementById(chartElementIdSelector)) return

  const tableChart = dataTable(chartElementIdSelector)

  createTableHeader()

  tableChart
    .dimension(cfDimension)
    .showSections(false)
    .size(Infinity)
    .columns(tableHeaderConfig.map((entry) => entry.format))

  tableChart.render()
  select(tileElementIdSelector).classed("loading", false)

  function createTableHeader() {
    const tableHeaderTHs = select(chartElementIdSelector + " .table-header").selectAll("th")

    select(chartElementIdSelector).attr(
      "style",
      "grid-template-columns: " +
        tableHeaderConfig.map((d: TableConfigEntry) => columnWidth(d)).join(" "),
    )

    // enter() into virtual selection and create new <th> header elements for each table column
    tableHeaderTHs
      .data(tableHeaderConfig)
      .enter()
      .append("th")
      .attr("class", (d) => d.className)
      .classed("sortable", (d) => d.sortAccessor !== undefined)

    tableHeaderTHs
      .append("span")
      .classed("label", true)
      .text((d: TableConfigEntry) => d.label) // Accessor function for header titles

    const sortableHeaders = tableHeaderTHs.filter(
      (d: TableConfigEntry) => d.sortAccessor !== undefined,
    )

    sortableHeaders.append("span").classed("sort-state", true).text(" ")
    sortableHeaders.on("click", tableHeaderCallback)

    // tableHeaderTHs.append("span").classed("resize-handle", true)

    function tableHeaderCallback(this: any, d: any) {
      // Highlight column header being sorted and show bootstrap glyphicon

      // sort_state = select(this).attr("class"d.sort_state === "ascending" ? "descending" : "ascending"
      const sortState = select(this).attr("data-sort")
      const newSortState = sortState === "ascending" ? "descending" : "ascending"

      select(chartElementIdSelector + " .table-header")
        .selectAll("th") // Disable all highlighting and icons
        .attr("data-sort", null)

      select(this).attr("data-sort", newSortState)

      const isAscendingOrder = newSortState === "ascending"
      const sortAccessor = this.__data__.sortAccessor

      tableChart.order(isAscendingOrder ? ascending : descending).sortBy(sortAccessor)

      tableChart.render()
      select(tileElementIdSelector).classed("loading", false)
    }
  }
  select(tileElementIdSelector + " .download").on("click", () => {
    // if (select('#download-type input:checked').node().value === 'table') {
    //   // collect the data displayed in the table as an array of arrays
    //   const data = Array.from(
    //     document.querySelector(chartElementIdSelector)?.querySelectorAll('tr')?
    //   ).map(row =>
    //     Array.from(row.querySelectorAll('th, td')).map(c => c.innerText)
    //   );

    //   // convert to a raw string
    //   rawData = csvFormatRows(data);
    // } else {
    // collect the data from Crossfilter
    const data = cfDimension.top(Infinity)

    // convert to raw string
    const rawData = csvFormat(data)
    const fileName = dimension + ".csv"
    const file = new File([rawData], fileName, {
      lastModified: Date.now(),
      type: "text/csv;charset=utf-8",
    })
    const exportUrl = URL.createObjectURL(file)
    window.location.assign(exportUrl)
    URL.revokeObjectURL(exportUrl)
    // const blob = new Blob([rawData], {
    //   type: 'text/csv;charset=utf-8',
    //   filename: dimension + ".csv"
    // });

    // const link=window.URL.createObjectURL(blob);
    // window.location = link;

    // use HTML5 save support viahttps://github.com/eligrey/FileSaver.js
    // saveAs(blob, 'data.csv');
  })
}
