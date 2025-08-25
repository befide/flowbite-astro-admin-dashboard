/* eslint-disable @typescript-eslint/no-explicit-any */
import { select } from "d3"
import { rowChart } from "dc"
import { baselineHeight, charts, getChartWidth, margins } from "."

export const rowChartTileId = (collection: string, dimension: string) => {
  return "dc-explorer__tile--" + collection + "-" + dimension
}
export const rowChartId = (collection: string, dimension: string) => {
  return "dc-explorer__row-chart--" + collection + "-" + dimension
}

export function createRowChart(
  collection: string,
  dimension: string,
  cfDimension: any,
  cfGroup: any
) {
  const tileElementIdSelector = "#" + rowChartTileId(collection, dimension)
  const chartElementIdSelector = "#" + rowChartId(collection, dimension)

  const filterWidth = getChartWidth(chartElementIdSelector)

  const tileElement = select(tileElementIdSelector)
  const height = (cfGroup.all().length * 0.5 + 1) * baselineHeight

  const chart = rowChart(chartElementIdSelector)
    .width(filterWidth)
    .height(height)
    .renderTitleLabel(true)
    .transitionDuration(50)
    .labelOffsetX(0 * baselineHeight)
    .titleLabelOffsetX(filterWidth - 1.75 * baselineHeight)
    .title((d) => d.value)
    .label((d) => d.key)
    .margins({
      ...margins,
      top: 0.5 * baselineHeight,
      left: 1.5 * baselineHeight,
    })
    .fixedBarHeight(0.35 * baselineHeight)
    .gap(0.15 * baselineHeight)

    .elasticX(false)
    .dimension(cfDimension)
    .group(cfGroup)
    .ordering(function (d) {
      return d.label
    })

  // chart.xAxis().ticks(5).tickSizeInner(-10)
  chart.on("renderlet", () => {
    // const rects = chart.selectAll("g.row rect")
    // rects.nodes().forEach((d) => {
    //   // select(d)
    //   //   .attr("height", 2)
    //   //   .attr("transform", "translate(0," + baselineHeight * 0.25 + ")")
    // })

    tileElement.classed("filtered", chart.hasFilter())
  })

  charts.set(rowChartId(collection, dimension), chart)
  return chart
}
