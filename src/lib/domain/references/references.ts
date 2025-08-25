import { getCollection, type CollectionEntry } from "astro:content"

export async function getReferences(tag?: string) {
  const references = (await getCollection(
    "references"
  )) as CollectionEntry<"references">
  return tag
    ? references.filter((r) => r.data.tags.indexOf(tag) > -1)
    : references
}
