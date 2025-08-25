/* eslint-disable @typescript-eslint/no-explicit-any */
import { glob } from "astro/loaders"

import { defineCollection, z } from "astro:content"

import {
  LocalizedString,
  NestableDomainObjectZodSchema,
  NullableLocalizedString,
  ReviewSchema,
} from "@lib/content.common.ts"

export const peopleCountGender = z.object({
  male: z.number().optional().nullable(),
  female: z.number().optional().nullable(),
  nonbinary: z.number().optional().nullable(),
})
export const peopleCountDiscipline = z.object({
  physicist: peopleCountGender,
  engineer: peopleCountGender,
  other: peopleCountGender,
})
export const peopleCountAcademicCareerLevel = z.object({
  professor: peopleCountDiscipline,
  seniorResearcher: peopleCountDiscipline,
  postDoc: peopleCountDiscipline,
  phdStudent: peopleCountDiscipline,
  masterStudent: peopleCountDiscipline,
  bachelorStudent: peopleCountDiscipline,
})

export const BefideOrganizationMetaBefideOrganizationCategories = z.enum([
  "fraunhofer",
  "hgf",
  "international",
  "mpg",
  "government",
  "university",
  "committee",
  "funder",
  "root",
  "consortium",
])

export const OrganizationZodSchema = NestableDomainObjectZodSchema.extend({
  topLevel__id: z.string().nullable(),
  instanceOfs__taxonomyId: z.array(z.string()),
  befideOrganizationCategories: z.preprocess((input) => {
    return (input + "").split(/\s?,\s?/).toSorted()
  }, z.array(BefideOrganizationMetaBefideOrganizationCategories)),

  isPartOfCommunity: z.boolean(),
  label: z.object({
    fullName: LocalizedString,
    short: NullableLocalizedString,
  }),
  description: NullableLocalizedString,
  links: z.object({
    homepage: NullableLocalizedString,
    rorId: z.string().optional().nullable(),
  }),
  location: z
    .object({
      country: z
        .object({
          code: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),

      city: z.string().optional().nullable(),
      lat: z.number().optional().nullable(),
      lng: z.number().optional().nullable(),
    })
    .optional()
    .nullable(),
  uniquePeopleCount: peopleCountAcademicCareerLevel,
  uniquePeopleCountSum: z.object({
    total: z.preprocess((v) => v || 0, z.number()),
    ...peopleCountDiscriminators.reduce((obj: any, value) => {
      obj[value] = z.preprocess((v) => v || 0, z.number())
      return obj
    }, {}),
  }),
  uniquePeopleCountRecursiveSum: z
    .object({
      total: z.number(),
      ...peopleCountDiscriminators.reduce((obj: any, value) => {
        obj[value] = z.preprocess((v) => v || 0, z.number())
        return obj
      }, {}),
    })
    .optional(),
  review: ReviewSchema,
})

export const defineOrganizationCollection = defineCollection({
  loader: glob({
    pattern: "**/*.(md|mdx)",
    base: "./src/content/domain/organizations",
  }),
  schema: OrganizationZodSchema,
})

export type OrganizationSchema = z.infer<typeof OrganizationZodSchema>

import fastCartesian from "fast-cartesian"
import {
  careerLevels,
  disciplinaryProfessions,
  genders,
  peopleCountDiscriminators,
} from "./index.ts"

const product = fastCartesian([
  [...careerLevels],
  [...disciplinaryProfessions],
  [...genders],
])
