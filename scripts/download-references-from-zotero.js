import api from "zotero-api-client"
import fs from "node:fs"
import path from "node:path"

const responsePages = [100, 200, 300, 400, 500, 600]
const items = await Promise.all(
  responsePages.flatMap(async (page) => {
    try {
      const response = await api

        .default("XDG2xtjGo4SXskg2lj1eC0DN", {
          start: page - 99,
          limit: 100,
        })
        .library("group", 2427654)
        .top()
        .items()
        .get()
      const data = await response.raw
      return data
    } catch (err) {
      console.error(`I'm down, this time. ${err}`)
    }
  })
)

const flattenedItems = items.flat()

console.log("References downloaded: " + flattenedItems.length)

try {
  fs.writeFileSync(
    path.join("./src/data/zotero/kfb_bf2035.json"),
    JSON.stringify(flattenedItems, null, 2),
    "utf8"
  )
  console.log("Data successfully saved to disk")
} catch (error) {
  console.log("An error has occurred ", error)
}
