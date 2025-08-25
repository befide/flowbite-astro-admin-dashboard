import { z } from "zod"
import {
  LocalizedString,
  NestableDomainObjectZodSchema,
  NullableLocalizedString,
  ReviewSchema,
} from "@lib/content.common.ts"

export const genders = ["female", "male", "nonbinary"]
export const careerLevels = [
  "professor",
  "seniorResearcher",
  "postDoc",
  "phdStudent",
  "masterStudent",
  "bachelorStudent",
]
export const disciplinaryProfessions = ["physicist", "engineer", "other"]
export const peopleCountDiscriminators = [
  ...careerLevels,
  ...disciplinaryProfessions,
  ...genders,
]

const peopleCountGender = z.object({
  male: z.number().optional().nullable(),
  female: z.number().optional().nullable(),
  nonbinary: z.number().optional().nullable(),
})
const peopleCountDiscipline = z.object({
  physicist: peopleCountGender,
  engineer: peopleCountGender,
  other: peopleCountGender,
})
const peopleCountAcademicCareerLevel = z.object({
  professor: peopleCountDiscipline,
  seniorResearcher: peopleCountDiscipline,
  postDoc: peopleCountDiscipline,
  phdStudent: peopleCountDiscipline,
  masterStudent: peopleCountDiscipline,
  bachelorStudent: peopleCountDiscipline,
})

export const ElectoralGroupSchema = z.enum([
  "hgf",
  "international",
  "university",
  "other",
])

export const OrganizationalUnitZodSchema = NestableDomainObjectZodSchema.extend(
  {
    topLevel__id: z
      .string()
      .nullable()
      .describe(
        "Identifier of the top-level (formal) organization the unit belongs to."
      ),
    instanceOfs__taxonomyId: z
      .array(z.string())
      .describe(
        "Taxonomy references describing the organisational unit type. Usually of cardinality 1, but then there is the polymorph KIT. Possible values include: `committee`, `committee/erum-committee`, `consortium`, `department`, `funding-organization`, `research-institution`, `subdepartment`, `university`, `working-group`"
      ),
    electoralGroup: ElectoralGroupSchema.optional().describe(
      "Electoral group as defined by the KfB Statute. Possible values: `hgf`, `university`, `international`, `other`"
    ),

    isPartOfCommunity: z
      .boolean()
      .describe("Indicates whether the unit is part of the community."),
    label: z.object({
      fullName: LocalizedString.describe(
        "Official, localized name of the unit (e.g., `Europäische Organisation für Kernforschung`)"
      ),
      short: NullableLocalizedString,
    }),
    tagLine: NullableLocalizedString.describe(
      "Europäische Organisation für Kernforschung"
    ),
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
  }
)
