/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Axis, format, scaleLinear, select } from "d3"
import { barChart } from "dc"
import { baselineHeight, charts, getChartWidth, margins } from "."

export const barChartTileId = (collection: string, dimension: string) => {
  return "dc-explorer__tile--" + collection + "-" + dimension
}
export const barChartId = (collection: string, dimension: string) => {
  return "dc-explorer__bar-chart--" + collection + "-" + dimension
}

export function createBarChart(
  collection: string,
  dimension: string,
  cfDimension: any,
  cfGroup: any
) {
  const tileElementIdSelector = "#" + barChartTileId(collection, dimension)
  const chartElementIdSelector = "#" + barChartId(collection, dimension)

  const allYears = cfGroup
    .top(Infinity)
    .map((y: { key: number }) => +y.key)
    // .filter((y) => y !== "")
    .sort()

  const filterWidth = getChartWidth(chartElementIdSelector)
  const tileElement = select(tileElementIdSelector)
  const chart = barChart(chartElementIdSelector)
    .x(
      scaleLinear().domain([
        (allYears[0] || 0) - 0,
        allYears[allYears.length - 1] + 0.5,
      ])
    )
    .width(filterWidth)
    .height(4 * baselineHeight)
    .elasticY(false)
    .elasticX(false)
    .centerBar(true)
    .dimension(cfDimension)
    .group(cfGroup)
    .margins({
      ...margins,
      left: 1.5 * baselineHeight,
      bottom: 1 * baselineHeight,
    })
    .renderHorizontalGridLines(true)

    .on("renderlet", () => {
      tileElement.classed("filtered", chart.hasFilter())
    })

  const xAxis = chart.xAxis() as Axis<number>

  xAxis.ticks(4).tickFormat(format("2"))

  chart.yAxis().ticks(2)

  charts.set(barChartId(collection, dimension), chart)
  return chart
}
