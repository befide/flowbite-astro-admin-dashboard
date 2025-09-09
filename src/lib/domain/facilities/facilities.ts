import {
  type CollectionEntry,
  getCollection,
  getEntry,
} from "astro:content"

import {
  flattenTreeNodes,
  getRoots,
} from "../../content.tree.ts"
import { ascending } from "d3"
import {
  getLocalizedValue,
  getReferenceLocalizedValue,
  getTaxonomyReferenceTerm,
} from "../../content.ts"
import { Facility } from "./facility.ts"
import type {
  FacilityDto,
  FacilitySchema,
} from "@lib/common"

export const getFacilities = async (options: {
  hostId?: string
  isUserFacility?: boolean
  lifeCycleCategory?: number
}) =>
  await getCollection(
    "facilities",
    (f: CollectionEntry<"facilities">) => {
      return (
        (options.hostId === undefined ||
          f.data.host__organizationsId ===
            options.hostId) &&
        (options.isUserFacility === undefined ||
          f.data.isUserFacility ===
            options.isUserFacility) &&
        (options.lifeCycleCategory === undefined ||
          !f.data.lifeCycle?.currentStatus__taxonomyId ||
          f.data.lifeCycle?.currentStatus__taxonomyId.indexOf(
            "/" + options.lifeCycleCategory,
          ) > -1)
      )
    },
  )

export const getFacilityRoots = (
  items: FacilitySchema[],
) => {
  return getRoots<FacilitySchema>(items)
}

export const facilitiesForAPI = async (locale: string) => {

  const facilities = (await getFacilities({})).map(
    (d) => d.data
  )

  const roots = getFacilityRoots(facilities)

  const flattened = flattenTreeNodes(roots)
    .toSorted((a, b) => ascending(a.id, b.id))


    return await Promise.all(flattened.map(async (item) => ({
      id: item.id,
      depth: item.depth,
      height: item.children.length,
      parent__id: item.data.parent__id,
      successorOf__id: item.data.successorOf__id,
      currentStatus_label:
        item.data.lifeCycle.currentStatus__taxonomyId &&
        getTaxonomyReferenceTerm(
          item.data.lifeCycle.currentStatus__taxonomyId,
          locale
        ),

      label: getLocalizedValue(item, "data.label", locale) + "xxx",
      tagLine: getLocalizedValue(
        item,
        "data.tagLine",
        locale,
      ),
      // currentStatus_label,
      operation_startYear:
        item.data.lifeCycle.operation?.startYear,
      operation_endYear:
        item.data.lifeCycle.operation?.endYear,

      isUserFacility: item.data.isUserFacility,
      isBMBF_FIS: item.data.isBMBF_FIS,

      ...item.data.parameters,
      host_label:
        item.data.host__organizationsId &&
        getLocalizedValue(
          await getEntry(
            "organizations",
            item.data.host__organizationsId,
          ),
          "data.label.short",
          locale,
        ),
      instanceOf__label:
        (await getTaxonomyReferenceTerm(
          item.data.instanceOf__taxonomyId,
          locale,
        )) || "",
    })))
}

export async function facilitiesForAPI2(
  locale = "en",
): Promise<FacilityDto[]> {
  const facilities = await getFacilities({})

  return await Promise.all(
    facilities.map(
      async (facility: FacilitySchema) =>
        await new Facility(facility.data).getDto(locale),
    ),
  )
}
