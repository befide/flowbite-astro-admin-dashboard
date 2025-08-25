import { getEntry } from "astro:content"

import { getLocalizedValue } from "../../content.ts"

import { type FacilitySchema } from ".."

export type Facilities = Facility[]

export type FacilityDto = Pick<FacilitySchema, "id"> & {
  label: string
  tagLine: string
  host__label_short: string
  parent__id: string | null
  instanceOf__term: string
  currentStatus__term: string
  operation_startYear: number | null
  operation_endYear: number | null
  isUserFacility: boolean
  isBMBF_FIS: boolean
  primaryBeamParticles: string[]
  secondaryBeamParticles: string[]
  length__m: number | null
}

export class Facility {
  _data: FacilitySchema

  constructor(data: FacilitySchema) {
    this._data = data
  }

  async getDto(locale: string): Promise<FacilityDto> {
    const instanceOf__term =
      (this._data.instanceOf__taxonomyId &&
        getLocalizedValue(
          await getEntry("taxonomyItems", this._data.instanceOf__taxonomyId),
          "data.term",
          locale
        )) ||
      ""
    const host__label_short =
      (this._data.host__organizationsId &&
        getLocalizedValue(
          await getEntry("organizations", this._data.host__organizationsId),
          "data.label.short",
          locale
        )) ||
      ""

    const currentStatus__term =
      (this._data.lifeCycle.currentStatus__taxonomyId &&
        getLocalizedValue(
          await getEntry(
            "taxonomyItems",
            this._data.lifeCycle.currentStatus__taxonomyId
          ),
          "data.term",
          locale
        )) ||
      ""

    return {
      id: this._data.id,
      parent__id: this._data.parent__id,
      label: getLocalizedValue(this._data, "label", locale),
      tagLine: getLocalizedValue(this._data, "tagLine", locale),
      host__label_short,
      instanceOf__term: instanceOf__term,
      currentStatus__term: currentStatus__term,

      operation_startYear: this._data.lifeCycle.operation?.startYear,
      operation_endYear: this._data.lifeCycle.operation?.endYear,
      isUserFacility: this._data.isUserFacility,
      isBMBF_FIS: this._data.isBMBF_FIS,
      primaryBeamParticles: this._data.parameters.primaryBeamParticles,
      secondaryBeamParticles: this._data.parameters.secondaryBeamParticles,
      length__m: this._data.parameters.length__m,
    }
  }
}
