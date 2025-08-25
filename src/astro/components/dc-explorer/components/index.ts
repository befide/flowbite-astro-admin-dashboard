/* eslint-disable @typescript-eslint/no-explicit-any */
import { select } from "d3"

export * from "./count-chart"
export * from "./bar-chart"
export * from "./row-chart"
export * from "./table"
export * from "./tree-data-table"
export * from "./tree-data-sections"

export const charts = new Map<string, any>()
export const baselineHeight = 28
export const maxFilterWidth = 250

export const rowBarRatio = 0.9

export const margins = {
  top: baselineHeight,
  right: 0.5 * baselineHeight,
  bottom: baselineHeight,
  left: 0.25 * baselineHeight,
}

export function getLocale(): string {
  return document.location.href.indexOf("/de/") > -1 ? "de" : "en"
}

export const getValue = (obj: any, path: string) => {
  if (!obj) return

  const keys = path.split(".")

  return keys.reduce((currentObj, key) => currentObj[key], obj)
}

export const getChartWidth = (containerSelector: any) =>
  Number(select(containerSelector).style("width").slice(0, -2))
