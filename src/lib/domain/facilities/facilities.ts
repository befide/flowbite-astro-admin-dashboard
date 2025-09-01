import {type CollectionEntry, getCollection, getEntry} from "astro:content"

import { flattenTreeNodes, getRoots } from "../../content.tree.ts"
import { ascending } from "d3"
import { getLocalizedValue } from "../../content.ts"
import { Facility } from "./facility.ts"
import type {FacilityDto, FacilitySchema} from "@lib/common";

export const getFacilities = async (options: {
  hostId?: string
  isUserFacility?: boolean
  lifeCycleCategory?: number
}) =>
  await getCollection("facilities", (f: CollectionEntry<"facilities">) => {
    return (
      (options.hostId === undefined ||
        f.data.host__organizationsId === options.hostId) &&
      (options.isUserFacility === undefined ||
        f.data.isUserFacility === options.isUserFacility) &&
      (options.lifeCycleCategory === undefined ||
        !f.data.lifeCycle?.currentStatus__taxonomyId ||
        f.data.lifeCycle?.currentStatus__taxonomyId.indexOf(
          "/" + options.lifeCycleCategory
        ) > -1)
    )
  })

export const getFacilityRoots = (items: FacilitySchema[]) => {
  return getRoots<FacilitySchema>(items)
}

export const facilitiesForAPI = async (locale: string) => {
  const facilities = (await getFacilities({})).map((d) => d.data)

  const expandedFacilities = await Promise.all(
    facilities.map(async (facility) => ({
      ...facility,
      // isInstanceOf_id: facility.isInstanceOf_id,
      host_label:
        facility.host__organizationsId &&
        getLocalizedValue(
          await getEntry("organizations", facility.host__organizationsId),
          "data.label.short",
          locale
        ),
      instanceOf_label:
        facility.instanceOf__taxonomyId &&
        getLocalizedValue(
          await getEntry("taxonomyItems", facility.instanceOf__taxonomyId),
          "data.term",
          locale
        ),
      currentStatus_label:
        facility.lifeCycle.currentStatus__taxonomyId &&
        getLocalizedValue(
          await getEntry(
            "taxonomyItems",
            facility.lifeCycle.currentStatus__taxonomyId
          ),
          "data.term",
          locale
        ),
      lifeCycle: {
        ...facility.lifeCycle,
      },
    }))
  )

  const roots = getFacilityRoots(expandedFacilities)

  return flattenTreeNodes(roots)
    .toSorted((a, b) => ascending(a.id, b.id))
    .map((item) => ({
      id: item.id,
      depth: item.depth,
      height: item.children.length,
      parent__id: item.data.parent__id,
      successorOf__id: item.data.successorOf__id,

      label: getLocalizedValue(item, "data.label", locale),
      tagLine: getLocalizedValue(item, "data.tagLine", locale),
      // currentStatus_label,
      operation_startYear: item.data.lifeCycle.operation?.startYear,
      operation_endYear: item.data.lifeCycle.operation?.endYear,
      instanceOf_label: expandedFacilities,
      isUserFacility: item.data.isUserFacility,
      isBMBF_FIS: item.data.isBMBF_FIS,

      ...item.data.parameters,
    }))
}

export async function facilitiesForAPI2(locale = "en"): Promise<FacilityDto[]> {
  const facilities = await getFacilities({})

  return await Promise.all(
    facilities.map(
      async (facility: FacilitySchema) => await new Facility(facility.data).getDto(locale)
    )
  )
}
