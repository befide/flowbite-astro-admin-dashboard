/**
 * @import {Callback} from 'unified-engine'
 */

import process from "node:process"
import { remark } from "remark"
import { engine } from "unified-engine"

engine(
  {
    color: true,
    extensions: [
      "md",
      "mdx",
      "markdown",
      "mkd",
      "mkdn",
      "mkdown",
    ],
    files: ["./src/content/**/*"],
    ignoreName: ".remarkignore",
    packageField: "remarkConfig",
    pluginPrefix: "remark",
    processor: remark,
    rcName: ".remarkrc",
  },
  done,
)

/** @type {Callback} */
function done(error, code) {
  if (error) throw error
  process.exitCode = code
}
