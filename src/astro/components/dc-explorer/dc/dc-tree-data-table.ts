import type { TreeNode } from "@lib/content.tree"
import type { NestableDomainObjectSchema } from "@lib/content.common"
import {
  hierarchy,
  select,
  type Selection,
  stratify,
} from "d3"
import { ascending, descending } from "d3"
import { baseMixin } from "dc"

const treeNode = (
  items: TreeNode<NestableDomainObjectSchema>[],
  selectedItems: TreeNode<NestableDomainObjectSchema>[],
) => {
  // console.log("treeNode")
  const selectedItemIds = selectedItems
    ? selectedItems.map((d) => d.id)
    : items.map((d) => d.id)

  const decoratedItems = items.map((item) => ({
    ...item,
    isSelected: selectedItemIds.indexOf(item.id) > -1,
  }))

  const roots = decoratedItems.filter((d) => !d.parent__id)

  const rootedEntries =
    roots.length === 1
      ? decoratedItems
      : decoratedItems
          .map((d) => ({
            ...d,
            parent__id: d.parent__id ? d.parent__id : ":",
          }))
          .concat([
            {
              id: ":",
              parent__id: null,
            },
          ])

  const root = stratify()
    .id((d) => d.id)
    .parentId((d) => d.parent__id)(rootedEntries)

  const tree = hierarchy(root, (d) => d.children).sum(
    (d) => (d.children?.length > 0 ? 0 : 1),
  )

  return tree
}

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
export default function (parent, chartGroup?) {
  const LABEL_CSS_CLASS = "dc-tree-table-label"
  const ROW_CSS_CLASS = "dc-table-row"
  const COLUMN_CSS_CLASS = "dc-table-column"
  const SECTION_CSS_CLASS =
    "dc-table-section dc-table-group"
  const HEAD_CSS_CLASS = "dc-table-head"

  const _chart = baseMixin({})

  let _allEntries
  let _entriesMap = {}
  const _ancestorsMap = {}
  let _allEntriesTree
  let _size = 25
  let _columns = []
  let _sortBy = function (d) {
    return d
  }
  let _order = ascending
  const _beginSlice = 0
  let _endSlice
  let _showSections = true
  let _section = function () {
    return ""
  } // all in one section
  _chart._mandatoryAttributes(["dimension"])

  _chart._doRender = function () {
    _chart.selectAll("ul").remove()

    renderRoot()

    return _chart
  }

  _chart._doColumnValueFormat = function (v, d) {
    return typeof v === "function"
      ? v(d) // v as function
      : typeof v === "string"
        ? d[v] // v is field name string
        : v.format(d) // v is Object, use fn (element 2)
  }

  _chart._doColumnHeaderFormat = function (d) {
    // if 'function', convert to string representation
    // show a string capitalized
    // if an object then display its label string as-is.
    return typeof d === "function"
      ? _chart._doColumnHeaderFnToString(d)
      : typeof d === "string"
        ? _chart._doColumnHeaderCapitalize(d)
        : String(d.label)
  }

  _chart._doColumnHeaderCapitalize = function (s) {
    // capitalize
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  _chart._doColumnHeaderFnToString = function (f) {
    // columnString(f) {
    let s = String(f)
    const i1 = s.indexOf("return ")
    if (i1 >= 0) {
      const i2 = s.lastIndexOf(";")
      if (i2 >= 0) {
        s = s.substring(i1 + 7, i2)
        const i3 = s.indexOf("numberFormat")
        if (i3 >= 0) {
          s = s.replace("numberFormat", "")
        }
      }
    }
    return s
  }

  function treeRoot() {
    const selectedEntries =
      _order === descending
        ? _chart.dimension().top(_size)
        : _chart.dimension().bottom(_size)

    // const uniqueSelectedEntries = new Set(
    //   selectedEntries.map((entry) => entry.id)
    // )
    const selectedEntriesAndAncestorIds =
      selectedEntries.flatMap((entry) => [
        entry.id,
        ..._ancestorsMap[entry.id],
      ])
    const uniqueSelectedEntriesAndAncestorIds = Array.from(
      new Set(selectedEntriesAndAncestorIds),
    )

    const selectedEntriesAndAncestors =
      uniqueSelectedEntriesAndAncestorIds
        .map((id) => _entriesMap[id])
        .filter((d) => !!d)

    //selectedEntriesAndAncestors.sort((a, b) => a.label.localeCompare(b.label))

    return treeNode(
      selectedEntriesAndAncestors,
      selectedEntries,
    )
  }

  function makeTree(selection) {
    selection
      .append("ul")
      .classed("tree", true)
      .append("li")
      .attr("depth", 0)
      .classed("collapsible", false)
      .classed("tree-node", true)
  }
  function updateTree(selection, root) {
    selection
      .select("li.tree-node")
      .call(updateNextLevel, treeRoot())
    // selection.select(".tree > .tree-node__row > span").remove()
  }

  function renderNode(selection, node) {
    if (node.children?.length > 0) {
      const details = selection.append("details")
      details.attr("open", true)

      const row = details.append("summary")
      row.classed("tree-node__row", true)

      const cells = row
        .selectAll(".tree-node__cell")
        .data(Array(_chart.columns().length).fill(node))
      cells
        .enter()
        .append("div")
        .classed("tree-node__cell", true)
        .html((d, i) =>
          node.parent
            ? _chart.columns()[i].format(d)
            : _chart.columns()[i].label,
        )

      //recurse pass ul as parentDOM
    } else {
      const row = selection.append("div")
      row.classed("tree-node__row", true)

      const cells = row
        .selectAll(".tree-node__cell")
        .data(Array(_chart.columns().length).fill(node))
      cells
        .enter()
        .append("div")
        .classed("tree-node__cell", true)
        .html((d, i) => _chart.columns()[i].format(d))
    }
  }

  // Recursively append child nodes
  function updateNextLevel(selection, node) {
    selection.call(renderNode, node.data)
    if (!node.hasOwnProperty("children")) return
    const items = selection
      .append("ul")
      .classed("tree", true)
      .selectAll("li")
      .data(node.children, (d) => d.id)
    items.exit().remove()
    items
      .enter()
      .append("li")
      .classed("tree-node", true)
      .classed("has-children", node.children)
      .attr("depth", (d) => d.depth)
      .merge(items)
      .each(function (d) {
        select(this).call(updateNextLevel, d)
      })
  }

  function renderRoot() {
    _chart
      .root()
      .call(makeTree)
      .call(updateTree, treeRoot())
  }

  _chart._doRedraw = function () {
    return _chart._doRender()
  } /**
   * Get or set the section function for the data table. The section function takes a data row and
   * returns the key to specify to {@link https://github.com/d3/d3-collection/blob/master/README.md#nest d3.nest}
   * to split rows into sections. By default there will be only one section with no name.
   *
   * Set {@link dc.dataTable#showSections showSections} to false to hide the section headers
   *
   * @method section
   * @memberof dc.dataTable
   * @instance
   * @example
   * // section rows by the value of their field
   * chart
   *     .section(function(d) { return d.field; })
   * @param {Function} section Function taking a row of data and returning the nest key.
   * @returns {Function|dc.dataTable}
   */

  _chart.section = function (section) {
    if (!arguments.length) {
      return _section
    }
    _section = section
    return _chart
  } /**
   * Backward-compatible synonym for {@link dc.dataTable#section section}.
   *
   * @method group
   * @memberof dc.dataTable
   * @instance
   * @param {Function} groupFunction Function taking a row of data and returning the nest key.
   * @returns {Function|dc.dataTable}
   */

  _chart.group = _chart.section
  /**
   * Get or set the table size which determines the number of rows displayed by the widget.
   * @method size
   * @memberof dc.dataTable
   * @instance
   * @param {Number} [size=25]
   * @returns {Number|dc.dataTable}
   */

  _chart.size = function (size) {
    if (!arguments.length) {
      return _size
    }
    _size = size
    return _chart
  } /**
       * Get or set the index of the beginning slice which determines which entries get displayed
       * by the widget. Useful when implementing pagination.
       *
       * Note: the sortBy function will determine how the rows are ordered for pagination purposes.

       * See the {@link http://dc-js.github.io/dc.js/examples/table-pagination.html table pagination example}
       * to see how to implement the pagination user interface using `beginSlice` and `endSlice`.
       * @method beginSlice
       * @memberof dc.dataTable
       * @instance
       * @param {Number} [beginSlice=0]
       * @returns {Number|dc.dataTable}
       */
  //
  // _chart.beginSlice = function (beginSlice) {
  //   if (!arguments.length) {
  //     return _beginSlice
  //   }
  //   _beginSlice = beginSlice
  //   return _chart
  // } /**
  //  * Get or set the index of the end slice which determines which entries get displayed by the
  //  * widget. Useful when implementing pagination. See {@link dc.dataTable#beginSlice `beginSlice`} for more information.
  //  * @method endSlice
  //  * @memberof dc.dataTable
  //  * @instance
  //  * @param {Number|undefined} [endSlice=undefined]
  //  * @returns {Number|dc.dataTable}
  //  */
  //
  // _chart.endSlice = function (endSlice) {
  //   if (!arguments.length) {
  //     return _endSlice
  //   }
  //   _endSlice = endSlice
  //   return _chart
  // }

  _chart.columns = function (columns) {
    if (!arguments.length) {
      return _columns
    }
    _columns = columns
    return _chart
  } /**
   * Get or set sort-by function. This function works as a value accessor at row level and returns a
   * particular field to be sorted by.
   * @method sortBy
   * @memberof dc.dataTable
   * @instance
   * @example
   * chart.sortBy(function(d) {
   *     return d.date;
   * });
   * @param {Function} [sortBy=identity function]
   * @returns {Function|dc.dataTable}
   */

  _chart.sortBy = function (sortBy) {
    if (!arguments.length) {
      return _sortBy
    }
    _sortBy = sortBy
    return _chart
  } /**
   * Get or set sort order. If the order is ` ascending`, the data table will use
   * `dimension().bottom()` to fetch the data; otherwise it will use `dimension().top()`
   * @method order
   * @memberof dc.dataTable
   * @instance
   * @see {@link https://github.com/d3/d3-array/blob/master/README.md#ascending  ascending}
   * @see {@link https://github.com/d3/d3-array/blob/master/README.md#descending  descending}
   * @example
   * chart.order( descending);
   * @param {Function} [order= ascending]
   * @returns {Function|dc.dataTable}
   */

  _chart.order = function (order) {
    if (!arguments.length) {
      return _order
    }
    _order = order
    return _chart
  } /**
   * Get or set if section header rows will be shown.
   * @method showSections
   * @memberof dc.dataTable
   * @instance
   * @example
   * chart
   *     .section([value], [name])
   *     .showSections(true|false);
   * @param {Boolean} [showSections=true]
   * @returns {Boolean|dc.dataTable}
   */

  _chart.showSections = function (showSections) {
    if (!arguments.length) {
      return _showSections
    }
    _showSections = showSections
    return _chart
  } /**
   * Backward-compatible synonym for {@link dc.dataTable#showSections showSections}.
   * @method showGroups
   * @memberof dc.dataTable
   * @instance
   * @param {Boolean} [showGroups=true]
   * @returns {Boolean|dc.dataTable}
   */

  _chart.allEntries = function (
    allEntries: NestableDomainObjectSchema[],
  ) {
    if (!arguments.length) {
      return _allEntries
    }

    if (allEntries.length > 0) {
      _allEntries = allEntries
      _entriesMap = allEntries.reduce(function (map, obj) {
        map[obj.id] = obj
        return map
      }, {})

      _allEntriesTree = treeNode(_allEntries)
      _allEntriesTree.each(
        (node) =>
          (_ancestorsMap[node.data.data.id] = node
            .ancestors()
            .map((d) => d.data.data.id)),
      )

      return _chart
    }
  }

  return _chart.anchor(parent, chartGroup)
}
