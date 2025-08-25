/* eslint-disable @typescript-eslint/no-explicit-any */

import type {NestableDomainObjectSchema} from "@lib/content.common"
import {ascending, descending, select} from "d3"
import {BaseMixin} from "dc"
import type {TableConfigEntry} from "../config.tables"
import {getRoots, type TreeNode} from "@lib/content.tree"

const LABEL_CSS_CLASS = "dc-tree-table-label"
const ROW_CSS_CLASS = "dc-table-row"
const COLUMN_CSS_CLASS = "dc-table-column"
const SECTION_CSS_CLASS = "dc-table-section dc-table-group"
const HEAD_CSS_CLASS = "dc-table-head"

// const forest = (
//   items: NestableDomainObjectSchema[],
//   selectedItems?: NestableDomainObjectSchema[]
// ) => {
//   const selectedItemIds = selectedItems
//     ? selectedItems.map((d) => d.id)
//     : items.map((d) => d.id)

//   // const decoratedItems = items.map((item) => ({
//   //   ...item,
//   //   isSelected: selectedItemIds.indexOf(item.id) > -1,
//   // }))

//   // const roots = decoratedItems.filter((d) => !d.parent__id)

//   // const rootedEntries =
//   //   roots.length === 1
//   //     ? decoratedItems
//   //     : [
//   //         ...decoratedItems.map((d) => ({
//   //           ...d,
//   //           parent__id: d.parent__id ? d.parent__id : ":",
//   //         })),
//   //         { id: ":", parent__id: "", isSelected: true },
//   //       ]

//   const roots = getRoots<NestableDomainObjectSchema>(rootedEntries)

//   // console.log({ roots })

//   // const tree = hierarchy(root, (d) => d.children)
//   // .sum((d) =>
//   //   d.children?.length > 0 ? 0 : 1
//   // )

//   return roots[0]
// }

/**
 * The data table is a simple widget designed to list crossfilter focused data set (rows being
 * filtered) in a good old tabular fashion.
 *
 * An interesting feature of the data table is that you can pass a crossfilter group to the
 * `dimension`, if you want to show aggregated data instead of raw data rows. This requires no
 * special code as long as you specify the {@link dc.dataTable#order order} as ` descending`,
 * since the data table will use `dimension.top()` to fetch the data in that case, and the method is
 * equally supported on the crossfilter group as the crossfilter dimension.
 *
 * If you want to display aggregated data in ascending order, you will need to wrap the group
 * in a [fake dimension](https://github.com/dc-js/dc.js/wiki/FAQ#fake-dimensions) to support the
 * `.bottom()` method. See the example linked below for more details.
 *
 * Note: Formerly the data table (and data grid chart) used the {@link dc.dataTable#group group} attribute as a
 * keying function for {@link https://github.com/d3/d3-collection/blob/master/README.md#nest nesting} the data
 * together in sections.  This was confusing so it has been renamed to `section`, although `group` still works.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * - {@link http://dc-js.github.io/dc.js/examples/table-on-aggregated-data.html dataTable on a crossfilter group}
 * ({@link https://github.com/dc-js/dc.js/blob/develop/web/examples/table-on-aggregated-data.html source})
 * @class dataTable
 * @memberof dc
 * @mixes dc.baseMixin
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.dataTable}
 */

export class TreeTable extends BaseMixin<NestableDomainObjectSchema> {
  _allEntries: NestableDomainObjectSchema[] = []
  _entriesMap: Map<string, NestableDomainObjectSchema> = new Map()
  _ancestorsMap: Map<string, NestableDomainObjectSchema[]> = new Map()
  // _allEntriesTree
  _size = 25
  _sortBy = (d: any) => d
  _order = ascending
  _columns: TableConfigEntry[] = []

  constructor(parent: string, cfDimension: any) {
    super()

    // this._size = 25;
    // this._columns = []
    // this._sortBy = d => d;
    // this._order = ascending;
    // this._beginSlice = 0;
    // this._endSlice = undefined;
    // this._showSections = true;
    // this._section = () => ''; // all in one section

    super._dimension = cfDimension
    super._group = cfDimension.groupAll()

    this.allEntries(cfDimension.top(Infinity))

    super._mandatoryAttributes(["dimension"])

    super.anchor(parent)
  }

  columns(columns: TableConfigEntry[]) {
    this._columns = columns
  }

  allEntries(allEntries: NestableDomainObjectSchema[]) {
    if (!arguments.length) {
      return this._allEntries
    }

    if (allEntries.length > 0) {
      this._allEntries = allEntries

      this._entriesMap.clear()
      allEntries.forEach((entry) => {
        this._entriesMap.set(entry.id, entry)
      })

      this._ancestorsMap.clear()
      allEntries.forEach((entry) => {
        if (entry.parent__id) {
          let parent = this._entriesMap.get(entry.parent__id)
          while (parent) {
            const ancestors = this._ancestorsMap.get(entry.id)
            if (ancestors) {
              this._ancestorsMap.set(entry.id, [...ancestors, parent])
            } else {
              this._ancestorsMap.set(entry.id, [parent])
            }

            if (parent.parent__id) {
              parent = this._entriesMap.get(parent.parent__id)
            } else {
              parent = undefined
            }
          }
        }
      })
    }
  }

  treeRoots() {
    const selectedEntries: NestableDomainObjectSchema[] =
      this._order === descending
        ? super.dimension().top(Infinity)
        : super.dimension().bottom(Infinity)

    // const uniqueSelectedEntries = new Set(
    //   selectedEntries.map((entry) => entry.id)
    // )
    const selectedEntriesAndAncestorIds = selectedEntries.flatMap(
      (entry: NestableDomainObjectSchema) => {
        const ancestors = this._ancestorsMap.get(entry.id)

        if (ancestors) {
          const ancestorIds = ancestors.map((d) => d.id)
          return [entry.id, ...ancestorIds]
        } else {
          return [entry.id]
        }
      }
    )
    const uniqueSelectedEntriesAndAncestorIds = Array.from(
      new Set(selectedEntriesAndAncestorIds)
    )

    const selectedEntriesAndAncestors = uniqueSelectedEntriesAndAncestorIds
      .map((id) => this._entriesMap.get(id))
      .filter((d) => !!d)

    const roots = getRoots<NestableDomainObjectSchema>(
      selectedEntriesAndAncestors
    )
    return roots
  }

  _doRender() {
    if (this._allEntries.length > 0) {
      super.selectAll("ul").remove()

      this.renderRoots()
    }

    return this
  }

  _doRedraw() {
    this._doRender()
    // console.log("redraw")
    // if (this._allEntries.length > 0) {
    //   super
    //     .selectAll("li.tree-node")
    //     .each((data: any, index: number, nodes: any) => {
    //       console.log({ data, index, nodes })
    //     })
    // }
  }

  updateNextLevel(selection: any, data: TreeNode<NestableDomainObjectSchema>) {
    selection.call((selection2: any) => this.renderNode(selection2, data))
    // if (!node.hasOwnProperty("children")) return
    const items = selection
      .append("ul")
      .classed("tree", true)
      .selectAll("li")
      .data(data.children)

    // items.exit().remove()

    items
      .enter()
      .append("li")
      .classed("tree-node", true)
      // .classed("has-children", (d) => d.children.length)
      .attr("depth", (d: TreeNode<NestableDomainObjectSchema>) => d.depth)
      // .merge(items)
      .each((data: any, index: number, nodes: any) => {
        this.updateNextLevel(select(nodes[index]), data)
      })
  }

  makeForest(
    selection: any,
    treeRoots: TreeNode<NestableDomainObjectSchema>[]
  ) {
    const rootItems = selection
      .append("ul")
      .classed("forest", true)
      .selectAll("li.tree-root")
      .data(treeRoots)
      .enter()

    return rootItems
      .append("li")
      .attr("depth", 0)
      .classed("collapsible", false)
      .classed("tree-root", true)
      .classed("tree-node", true)
  }

  renderRoots() {
    const treeRoots = this.treeRoots()

    super.root().call((selection: any) => {
      const forest = this.makeForest(selection, treeRoots)
      forest.each((data: any, index: number, nodes: any) => {
        this.updateNextLevel(select(nodes[index]), data)
      })
    })
  }

  // updateTree(selection: any) {
  //   selection.select("li.tree-node").call((selection2: any) => {
  //     this.updateNextLevel(selection2, that.treeRoot())
  //   })
  //   // selection.select(".tree > .tree-node__row > span").remove()
  // }
  // // Recursively append child nodes

  renderNode(selection: any, node: TreeNode<NestableDomainObjectSchema>) {
    if (node.children?.length > 0) {
      const details = selection.append("details")
      details.attr("open", true)

      const row = details.append("summary")
      row.classed("tree-node__row", true)

      const cells = row
        .selectAll(".tree-node__cell")
        .data(Array(this._columns.length).fill(node))
      cells
        .enter()
        .append("div")
        .classed("tree-node__cell", true)
        .attr("style", (_d: any, i: number) => this._columns[i].width)
        .html((d, i) => this._columns[i].format(d))

      //recurse pass ul as parentDOM
    } else {
      const row = selection.append("div")
      row.classed("tree-node__row", true)

      const cells = row
        .selectAll(".tree-node__cell")
        .data(Array(this._columns.length).fill(node))
      cells
        .enter()
        .append("div")
        .classed("tree-node__cell", true)
        .attr("style", (_d: any, i: number) => this._columns[i].width)
        .html((d: any, i: number) => this._columns[i].format(d))
    }
  }
}

// export const treeTable = (parent: string, chartGroup?: string) =>
//   new TreeTable(parent, chartGroup)
