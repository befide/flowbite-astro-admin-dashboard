import type { OrganizationDto, ThesisDto, CourseDto } from "@lib/common.d"

import { numberFormat, oneLineFormat, pillFormat } from "./config"

export type TableConfigEntry = {
  label: string
  className: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortAccessor?: (d: any) => string | number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  format: (a: any) => string
  width?: string
}

export function tableConfigMap(key: string): TableConfigEntry[] {
  if (key === "theses") {
    return [
      {
        label: "University",
        className: "text-short",
        sortAccessor: (d: ThesisDto) => d.university__label_short,
        format: function (d: ThesisDto) {
          return pillFormat(d.university__label_short)
        },
      },
      {
        label: "Author",
        sortAccessor: (d: ThesisDto) => d.author.familyName,
        className: "text-short",
        format: function (d: ThesisDto) {
          return `<div class='one-line'><div class='name'><span class='givenName'>${d.author.givenName}</span> <span class='familyName bold sc'>${d.author.familyName}</span></div>`
        },
      },
      {
        label: "Gender",
        className: "icon",
        sortAccessor: (d: ThesisDto) => d.author.gender as string,
        format: function (d: ThesisDto) {
          return `<div class='pillFormat'><span data-gender-icon='${d.author.gender}'>${d.author.gender}</span></div>`
        },
      },
      {
        label: "Title",
        className: "text-long",
        sortAccessor: (d: ThesisDto) => d.title,
        format: function (d: ThesisDto) {
          return "<div class='title truncable one-line'>" + d.title + "</div>"
        },
      },
      {
        label: "Year",
        className: "number",
        sortAccessor: (d: ThesisDto) => d.year,
        format: function (d: ThesisDto) {
          return numberFormat(d.year)
        },
      },
      {
        label: "Degree",
        width: "13ch",
        className: "text-short",
        sortAccessor: (d: ThesisDto) => d.degreeTitle,
        format: function (d: ThesisDto) {
          return pillFormat(d.degreeTitle)
        },
      },
      {
        width: "10ch",
        label: "language",
        className: "text-short",
        sortAccessor: (d: ThesisDto) => d.language,
        format: function (d: ThesisDto) {
          return pillFormat(d.language)
        },
      },
    ]
  } else if (key === "organizations") {
    return [
      {
        label: "short name",
        className: "text-short ",
        sortAccessor: (d: OrganizationDto) => d.label__short,
        format: function (d: OrganizationDto) {
          return `<a class='font-bold underline decoration-dotted' href="./formal-organizations/${d.id}">${d.label__short}</a>`
        },
      },
      {
        label: "full name",
        className: "text-long",
        sortAccessor: (d: OrganizationDto) => d.label__fullName,
        format: function (d: OrganizationDto) {
          return `<a class='underline decoration-dotted' href="./formal-organizations/${d.id}">${d.label__fullName}</a>`
        },
      },

      {
        label: "#staff",
        width: "15ch",
        className: "number",
        sortAccessor: (d: OrganizationDto) => d.people_count,
        format: function (d: OrganizationDto) {
          return numberFormat(d.people_count)
        },
      },

      {
        label: "#facilties",
        width: "15ch",
        className: "number",
        sortAccessor: (d: OrganizationDto) => d.facilities_count,
        format: function (d: OrganizationDto) {
          return numberFormat(d.facilities_count)
        },
      },

      {
        label: "#sws",
        width: "15ch",
        sortAccessor: (d: OrganizationDto) => d.weeklySemesterHours_count,
        className: "number",
        format: function (d: OrganizationDto) {
          return numberFormat(d.weeklySemesterHours_count)
        },
      },
      {
        label: "#theses",
        width: "15ch",
        className: "number",
        sortAccessor: (d: OrganizationDto) => d.theses_count,
        format: function (d: OrganizationDto) {
          return numberFormat(d.theses_count)
        },
      },
    ]
  } else if (key === "courses") {
    return [
      {
        label: "University",
        className: "text-short",
        sortAccessor: (d: CourseDto) => d.university__label_short,
        format: function (d: CourseDto) {
          return pillFormat(d.university__label_short)
        },
      },
      {
        label: "Title",
        className: "text-long",
        sortAccessor: (d: CourseDto) => d.title,
        format: function (d: CourseDto) {
          return oneLineFormat(d.title)
        },
      },
      {
        label: "Art",
        className: "text-short",
        sortAccessor: (d: CourseDto) => d.teachingEvent__term,
        format: function (d: CourseDto) {
          return pillFormat(d.teachingEvent__term)
        },
      },
      {
        label: "Weekly hours",
        className: "number",
        sortAccessor: (d: CourseDto) => d.weeklySemesterHours,
        format: function (d: CourseDto) {
          return numberFormat(d.weeklySemesterHours)
        },
      },
      {
        label: "Semesters",
        className: "text-short",
        format: function (d: CourseDto) {
          return oneLineFormat(d.semesters.join(", "))
        },
      },
      {
        label: "Link",
        className: "text-short",
        width: "10ch",
        format: function (d: CourseDto) {
          return "<div class='one-line'><a target='_blank' href=" + d.link + ">Link</a></div>"
        },
      },
    ]
  } else {
    return []
  }
}
