export { tableConfigMap } from "./config.tables"
export { treeTableConfigMap } from "./config.tree-tables"
export { treeSectionsConfigMap } from "./config.tree-sections"

export function numberFormat(value: number | null) {
  return (
    "<div class='number one-line'>" +
    (value && value > 0 ? value.toString() : "-") +
    "</div>"
  )
}
export function oneLineFormat(value = "") {
  return "<div class='one-line'>" + (value ? value : "") + "</div>"
}

export function pillFormat(value = "") {
  return "<div class='pill'>" + (value ? value : "") + "</div>"
}
