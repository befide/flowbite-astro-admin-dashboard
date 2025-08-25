import api from "zotero-api-client"
import fs from "node:fs"
import path from "node:path"

const responsePages = [100, 200, 300]
const items = (
  await Promise.all(
    responsePages.flatMap(async (page) => {
      try {
        const response = await api
          .default("XDG2xtjGo4SXskg2lj1eC0DN", {
            start: page - 99,
            limit: 100,
          })
          .library("group", 2427722)
          .items()
          .get()
        const data = await response.raw
        return data
      } catch (err) {
        console.error(`I'm down, this time. ${err}`)
      }
    })
  )
).flat()

try {
  fs.writeFileSync(
    path.join("./src/data/zotero/kfb_theses.json"),
    JSON.stringify(items, null, 2),
    "utf8"
  )
  console.log("Data successfully saved to disk")
} catch (error) {
  console.log("An error has occurred ", error)
}
