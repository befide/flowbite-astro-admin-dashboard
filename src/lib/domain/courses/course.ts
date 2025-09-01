import {type CollectionEntry, getEntry} from "astro:content"

import {getLocalizedValue, getReferenceLocalizedValue} from "../../content.ts"
import {getValueTranslation} from "@lib/domain";
import type {CourseDto, CourseSchema} from "@lib/common";


export type Courses = Course[]

export class Course {
  _data: CourseSchema

  constructor(data: CourseSchema) {
    this._data = data
  }

  async getDto(locale: string): Promise<CourseDto> {
    const studyLevels__term = (
      (await Promise.all(
        this._data.studyLevels__taxonomyId.map(
          async (d) => await getEntry("taxonomyItems", d)
        )
      )) as CollectionEntry<"taxonomyItems">[]
    )
      .filter((taxon: CollectionEntry<"taxonomyItems">) => !!taxon)
      .map((taxon: CollectionEntry<"taxonomyItems">) =>
        getLocalizedValue(taxon, "data.term", locale)
      )

    return {
      id: this._data.id,
      weeklySemesterHours: this._data.weeklySemesterHours,
      title: getLocalizedValue(this._data, "title", locale),
      teachingEvent__term: await getReferenceLocalizedValue(
        "taxonomyItems",
        this._data.teachingEvent__taxonomyId,
        "data.term",
        locale
      ),
      languages: this._data.languages.map((d) =>
        getValueTranslation(d, locale)
      ),
      studyLevels__term,
      link: (getLocalizedValue(this._data, "links.homepage", locale) ||
        this._data.links.homepage.de) as string,
      university__label_short: await getReferenceLocalizedValue(
        "organizations",
        this._data.university__organizationsId,
        "data.label.short",
        locale
      ),
      semesters: this._data.semesters.map((d) =>
        getValueTranslation(d, locale)
      ),
      partOfProgrammesOfStudy: this._data.partOfProgrammesOfStudy,
    }
  }
}
