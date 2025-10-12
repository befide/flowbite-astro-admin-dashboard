import type { TaxonomyItemSchema } from "@lib/common.d.ts"
import { getCollection } from "astro:content"

import { getRoots } from "../../content.tree.ts"

import { getLocalizedValue } from "../../content.ts"
import { TaxonomyItem } from "@domain/taxonomy/taxonomyItem.ts"
import { ascending } from "d3"

export const allTaxonomyItems = async (locale = "en") =>
  (await getCollection("taxonomyItems"))
    .map(({ data }) => data)
    .sort((a, b) => ascending(a.id, b.id))

export const taxonomyItemRoots = async (locale = "en") => {
  return getTaxonomyItemRoots(await allTaxonomyItems(locale))
}
export const getTaxonomyItemRoots = (items: TaxonomyItemSchema[]) => {
  return getRoots<TaxonomyItemSchema>(items)
}

export const taxonomyForAPI = async (locale = "en") => {
  const items = await allTaxonomyItems(locale)

  return await Promise.all(items.map(async (item) => await new TaxonomyItem(item).getDto(locale)))
}
