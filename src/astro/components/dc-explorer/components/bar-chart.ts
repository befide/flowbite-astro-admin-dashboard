/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Axis, format, max, min, scaleLinear, select } from "d3"
import { barChart, units } from "dc"
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
  cfGroup: any,
  binWidth: number,
) {
  const tileElementIdSelector = "#" + barChartTileId(collection, dimension)
  const chartElementIdSelector = "#" + barChartId(collection, dimension)

  const domain = cfGroup
    .top(Infinity)
    .map((y: { key: number }) => +y.key)
    // .filter((y) => y !== "")
    .sort()

  console.log(cfGroup.all())
  const filterWidth = getChartWidth(chartElementIdSelector)
  const tileElement = select(tileElementIdSelector)
  const chart = barChart(chartElementIdSelector)
    .x(scaleLinear().domain([min(domain) - binWidth / 2, max(domain) + binWidth]))
    .width(filterWidth)
    .height(4 * baselineHeight)
    .elasticY(true)
    .elasticX(false)
    .centerBar(true)
    .dimension(cfDimension)
    .group(cfGroup)
    .xUnits(units.fp.precision(binWidth))
    .barPadding(0.1)
    .margins({
      ...margins,
      left: 1.5 * baselineHeight,
      bottom: baselineHeight,
    })
    .renderHorizontalGridLines(true)

    .on("renderlet", () => {
      tileElement.classed("filtered", chart.hasFilter())
    })

  const xAxis = chart.xAxis() as Axis<number>

  xAxis.tickValues(cfGroup.all().map((d) => d.key))

  chart.yAxis().ticks(2)

  charts.set(barChartId(collection, dimension), chart)
  return chart
}
