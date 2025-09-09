import type { CollectionEntry } from "astro:content"
import { getCollection } from "astro:content"
import { type HierarchyNode, stratify } from "d3"

const sortByPath = (
  s1: CollectionEntry<"sections">,
  s2: CollectionEntry<"sections">,
) => s1.id.localeCompare(s2.id)

export function getPath(
  section: CollectionEntry<"sections">,
) {
  return `/${section.id}/`
}

export async function getSections() {
  const sections = await getCollection("sections")
  sections.sort(sortByPath)
  return sections
}

export async function getPrevNext(currentPath = "") {
  const sections = await getSections()

  const currentSectionIndex = sections.findIndex(
    (section) => section.id === currentPath,
  )

  // console.log({ currentPath, currentSectionIndex });

  let prevSectionIndex = currentSectionIndex - 1

  while (
    prevSectionIndex >= 0 &&
    sections[prevSectionIndex]?.data.excludeFromTour
  ) {
    prevSectionIndex -= 1
  }
  if (prevSectionIndex === -1)
    prevSectionIndex = sections.length - 1

  let nextSectionIndex = currentSectionIndex + 1
  while (
    nextSectionIndex < sections.length &&
    sections[nextSectionIndex]?.data.excludeFromTour
  ) {
    nextSectionIndex += 1
  }

  if (nextSectionIndex === sections.length)
    nextSectionIndex = 0

  // console.log({
  //   home: sections.find((s) => !s.data.excludeFromTour),
  //   prev: sections[prevSectionIndex],
  //   current: sections[currentSectionIndex],
  //   next: sections[nextSectionIndex],
  // });
  return {
    home: sections.find((s) => !s.data.excludeFromTour),
    prev: sections[prevSectionIndex],
    current: sections[currentSectionIndex],
    next: sections[nextSectionIndex],
  }
}

export type SectionTreeNode = HierarchyNode<
  CollectionEntry<"sections">
>

export async function getSectionsTreeRoot(): Promise<SectionTreeNode> {
  const sections = await getSections()

  const filteredSections = sections // .filter(s => !s.data.excludeFromToc)

  const root = stratify<CollectionEntry<"sections">>().path(
    (d) => getPath(d),
  )(filteredSections)

  return root
}
