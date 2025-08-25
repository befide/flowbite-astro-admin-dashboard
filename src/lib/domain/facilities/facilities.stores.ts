import { computed, task } from "nanostores"
import { $locale } from "@lib/nanostores/locale"
import crossfilter from "crossfilter2"

export const $facilities = computed($locale, (locale) =>
  task(async () => {
    return await fetch("/" + locale + "/api/facilities.json").then(
      (response) => {
        return response.json()
      }
    )
  })
)

export const $facilitiesIndex = computed($facilities, (facilities) =>
  task(async () => {
    return crossfilter((await facilities) || [])
  })
)
