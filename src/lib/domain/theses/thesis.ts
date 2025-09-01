import {getValueTranslation, type ThesisSchema} from ".."

import {getFacilitiesReferencesLabel, getOrganizationsReferencesShortLabel} from "@lib/content.ts";

export type Theses = Thesis[]


export interface Author {
  familyName: string
  givenName: string
  gender: string
}

export class Thesis {
  _data: ThesisSchema
  constructor(data: ThesisSchema) {
    this._data = data
  }

  async getDto(locale: string): Promise<ThesisDto> {
    const university__label_short = this._data.degree.grantedBy__organizationsId
      ? (
          await getOrganizationsReferencesShortLabel(
            [this._data.degree.grantedBy__organizationsId],
            locale
          )
        )[0]
      : getValueTranslation(this._data.publisher, locale)

    const organizations__label_short =
      await getOrganizationsReferencesShortLabel(
        this._data.hasAffiliation__organizationsId,
        locale
      )

    const facilities__label_short = await getFacilitiesReferencesLabel(
      this._data.isAbout.facility__facilitiesId,
      locale
    )

    return {
      id: this._data.id,
      title: this._data.title,
      author: {
        familyName: this._data.author.familyName,
        givenName: this._data.author.givenName,
        gender:
          this._data.author.gender &&
          getValueTranslation(this._data.author.gender, locale),
      },
      language: this._data.language,
      year: this._data.year,
      university__label_short,

      affiliations__label_short: organizations__label_short,
      facilities__label_short,
      degreeTitle: this._data.degree.title
        .replaceAll("dr.rer.nat.", "Dr. rer. nat.")
        .replaceAll("dr.-ing.", "Dr.-Ing."),
    }
  }
}
