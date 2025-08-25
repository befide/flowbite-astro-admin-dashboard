import type { TaxonomyItemSchema } from "@domain/taxonomy/taxonomy.config"
import { getCollection } from "astro:content"

import { getRoots } from "../../content.tree.ts"

import { getLocalizedValue } from "../../content.ts"
import { TaxonomyItem } from "@domain/taxonomy/taxonomyItem.ts"

export const allItems = async (locale = "en") =>
  (await getCollection("taxonomyItems"))
    .map(({ data }) => data)

    .sort((a, b) =>
      getLocalizedValue(a, "term", locale).localeCompare(
        getLocalizedValue(b, "term", locale)
      )
    )

export const taxonomyItemRoots = async (locale = "en") => {
  return getTaxonomyItemRoots(await allItems(locale))
}
export const getTaxonomyItemRoots = (items: TaxonomyItemSchema[]) => {
  return getRoots<TaxonomyItemSchema>(items)
}

export const taxonomyForAPI = async (locale = "en") => {
  const items = await allItems(locale)

  return await Promise.all(
    items.map(async (item) => await new TaxonomyItem(item).getDto(locale))
  )

  // const roots = await taxonomyItemRoots(locale)
  // const list = flattenTreeNodes(roots).map((item) => ({
  //   id: item.id,
  //   depth: item.depth,
  //   height: item.children.length,
  //   parent__id: item.data.parent__id,
  //   label: getLocalizedValue(item, "data.term", locale),
  //   definition: getLocalizedValue(item, "data.definition", locale),
  //   synonyms: item.data.synonyms,
  //   type: item.id.indexOf(":") > -1 ? "instance" : "class",
  //   taxonomyURI: item.data.taxonomyURI,
  //   reviewStatus: item.data.review.status_id,
  //   reviewReviewer: item.data.review.reviewer,
  // }))
  //
  // return list
}
