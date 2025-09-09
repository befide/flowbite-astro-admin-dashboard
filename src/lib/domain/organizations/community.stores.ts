import { computed, task } from "nanostores"
import { $locale } from "@lib/nanostores/locale"
import crossfilter from "crossfilter2"

export const $community = computed($locale, (locale) =>
  task(async () => {
    return await fetch(
      "/" + locale + "/api/community.json",
    ).then((response) => {
      return response.json()
    })
  }),
)

export const $communityIndex = computed(
  $community,
  (community) =>
    task(async () => {
      return crossfilter(community || [])
    }),
)
