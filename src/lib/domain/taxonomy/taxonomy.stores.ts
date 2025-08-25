import { computed, task } from "nanostores"
import crossfilter from "crossfilter2"
import { $locale } from "@lib/nanostores/locale"
import type { TaxonomyItemDto } from "@domain/taxonomy/taxonomyItem.ts"

export const $domainTaxonomy = computed($locale, (locale) =>
  task(async () => {
    return await fetch("/" + locale + "/api/taxonomy.json")
      .then((response) => response.json())
      .then((s) =>
        s.filter((d: TaxonomyItemDto) => d.taxonomyURI === "befidesh")
      )
  })
)

export const $domainTaxonomyIndex = computed($domainTaxonomy, (taxonomy) =>
  task(async () => {
    return crossfilter((await taxonomy) || [])
  })
)
export const $genericTaxonomy = computed($locale, (locale) =>
  task(async () => {
    return await fetch("/" + locale + "/api/taxonomy.json")
      .then((response) => response.json())
      .then((s) =>
        s.filter((d: TaxonomyItemDto) => d.taxonomyURI !== "befidesh")
      )
  })
)

export const $genericTaxonomyIndex = computed($genericTaxonomy, (taxonomy) =>
  task(async () => {
    return crossfilter((await taxonomy) || [])
  })
)
