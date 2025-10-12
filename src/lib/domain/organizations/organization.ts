import { type CollectionEntry, getCollection } from "astro:content"
import { useTranslations } from "@astro/i18n/utils"

import { getLocalizedValue, getTaxonomyReferencesTerm } from "../../content.ts"

import { ascending, descending, sum } from "d3"
import { getRoots } from "../../content.tree.ts"
import type { OrganizationDto, OrganizationSchema } from "@lib/common"

import { Thesis } from "@lib/domain"
import type { FacilitySchema } from "../../common.d"

export class Organization {
  _data: OrganizationSchema

  constructor(data: OrganizationSchema) {
    this._data = data
  }

  async getTheses() {
    const thesesData = await getCollection(
      "theses",
      ({ data }) => data.degree.grantedBy__organizationsId === this._data.id,
    )
    return thesesData
      .sort((a, b) => descending(a.data.year, b.data.year))
      .map((d) => new Thesis(d.data))
  }

  async getFacilityDefinitions(lifeCycle = "", isUserFacility = true) {
    const facilities: CollectionEntry<"facilities">[] = await getCollection(
      "facilities",
      (d) =>
        d.data.host__organizationsId === this._data.id && isUserFacility === d.data.isUserFacility,
    )

    // &&
    // (!options ||
    //   ((options.lifeCycleCategory === -1 || !data.lifeCycle?.currentStatus__taxonomyId || data.lifeCycle?.currentStatus__taxonomyId.indexOf("/" + options.lifeCycleCategory) > -1) &&
    //   !data.lifeCycle?.currentStatus__taxonomyId ||
    //   data.lifeCycle?.currentStatus__taxonomyId.indexOf("/" + options.lifeCycleCategory) > -1),

    return facilities
      .map((d) => d.data)
      .sort((a: FacilitySchema, b: FacilitySchema) => ascending(a.id, b.id))
    // return myFacilities.map((d) => new Facility(d.data as FacilitySchema))
  }

  async getTeachingEventsDefinitions() {
    const teachingEvents = await getCollection(
      "courses",
      (d) => d.data.university__organizationsId === this._data.id,
    )
    return teachingEvents.map((d) => d.data)
  }

  async getOrganizationList() {
    const organizations = await getCollection(
      "organizations",
      (o: CollectionEntry<"organizations">) =>
        o.data.topLevel__id === this._data.id || o.data.id === this._data.id,
    )
    return organizations.map((d) => d.data)
  }

  async getTreeRoots() {
    const organizations = (
      await getCollection(
        "organizations",
        (o: CollectionEntry<"organizations">) =>
          o.data.topLevel__id === this._data.id || o.data.id === this._data.id,
      )
    ).map((d) => d.data)

    return getRoots<OrganizationSchema>(organizations)
  }

  async getDto(locale: "en" | "de"): Promise<OrganizationDto> {
    const t = useTranslations(locale)
    const theses_count = (await this.getTheses()).length
    const facilities_count = (await this.getFacilityDefinitions()).length
    const userFacilities_count = (await this.getFacilityDefinitions(undefined, true)).length
    const teachingEvents = await this.getTeachingEventsDefinitions()

    const weeklySemesterHours_count = sum(teachingEvents.map((d) => d.weeklySemesterHours))

    return {
      id: this._data.id,
      uniquePeopleCountRecursiveSum: this._data.uniquePeopleCountRecursiveSum,
      uniquePeopleCount: this._data.uniquePeopleCount,
      instanceOfs__term: await getTaxonomyReferencesTerm(
        this._data.instanceOfs__taxonomyID,
        locale,
      ),
      category: this._data.category,
      theses_count,
      with_theses: theses_count > 0,
      facilities_count,
      with_facilities: facilities_count > 0,
      userFacilities_count,
      with_userFacilities: userFacilities_count > 0,
      teachingEvents_count: teachingEvents.length,
      weeklySemesterHours_count,
      with_teachingEvents: weeklySemesterHours_count > 0,
      parent__id: this._data.parent__id,
      label__short: getLocalizedValue(this._data, "label.short", locale),
      label__fullName: getLocalizedValue(this._data, "label.fullName", locale),
      location__country: t("country.name." + this._data.location?.country?.code) || "",
      location__city: this._data.location?.city as string,
      people_count: this._data.uniquePeopleCountRecursiveSum?.total || 0,
    }
  }
}
