import { defineCollection, z } from "astro:content"
import { DomainObjectZodSchema } from "@lib/content.common.ts"
import { globWithParser } from "@lib/globWithParser.ts"

// const INPUT_FILEPATH = path.join("src", "data", "zotero", "kfb_theses.json")
//
// const UNIVERSITY_IDS = [
//   ":hu-berlin",
//   ":kit",
//   ":rwth-aachen",
//   ":tu-berlin",
//   ":tu-darmstadt",
//   ":tu-dortmund",
//   ":tu-dresden",
//   ":uni-bonn",
//   ":uni-düsseldorf",
//   ":uni-erlangen",
//   ":uni-frankfurt",
//   ":uni-goettingen",
//   ":uni-hamburg",
//   ":uni-jena",
//   ":uni-kassel",
//   ":uni-mainz",
//   ":uni-rostock",
//   ":uni-siegen",
//   ":uni-wuppertal",
// ]
const cslDatePartsSchema = z.object({
  "date-parts": z.array(
    z.array(z.union([z.number(), z.string()])),
  ),
})

export const ThesisZodSchema = DomainObjectZodSchema.extend(
  {
    id: z.string(),
    citationKey: z.string(),
    type: z.string(),
    title: z.string(),
    "title-short": z.string().optional(),
    URL: z.string().optional(),
    DOI: z.string().optional(),
    "container-title": z.string().optional(),
    publisher: z.string().optional(),
    "publisher-place": z.string().optional(),
    edition: z.union([z.string(), z.number()]).optional(),
    volume: z.union([z.string(), z.number()]).optional(),
    number: z.union([z.string(), z.number()]).optional(),
    page: z.string().optional(),
    language: z.string().optional(),
    abstract: z.string().optional(),
    issued: cslDatePartsSchema.optional(),
    year: z.union([z.string(), z.number()]).optional(),
    month: z.union([z.string(), z.number()]).optional(),
    day: z.union([z.string(), z.number()]).optional(),
    author: z
      .array(
        z.object({
          given: z.string().optional(),
          family: z.string().optional(),
          literal: z.string().optional(),
        }),
      )
      .optional(),
    editor: z
      .array(
        z.object({
          given: z.string().optional(),
          family: z.string().optional(),
          literal: z.string().optional(),
        }),
      )
      .optional(),
    translator: z
      .array(
        z.object({
          given: z.string().optional(),
          family: z.string().optional(),
          literal: z.string().optional(),
        }),
      )
      .optional(),
    "container-author": z
      .array(
        z.object({
          given: z.string().optional(),
          family: z.string().optional(),
          literal: z.string().optional(),
        }),
      )
      .optional(),

    tags: z.array(z.string().optional()),
    degree: z.string().optional(),

    isA_taxonId: z.string().optional(), //reference("taxonomyItems").optional().nullable(),
    university__organizationsId: z.string().optional(), //reference("organizations").optional().nullable(),
    organizations__organizationsId: z.array(z.string()), // z.array(reference("organizations").optional().nullable()),
    facilities__facilityId: z.array(z.string()), //z.array(reference("facilities").optional().nullable()),
  },
)

export type ThesisSchema = z.infer<typeof ThesisZodSchema>

export const defineThesesCollection = defineCollection({
  loader: globWithParser({
    pattern: "**/*.md",
    base: "./src/content/theses",
    parser: async (entry) => {
      // const { id, data } = entry

      // if (!data.date) {
      //   // cast the data object to keep TypeScript happy
      //   ;(data as { date?: string }).date = id.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
      // }

      return entry
    },
  }),

  //   return dataRaw.flat().map((item: any) => {
  //     const dataItem: ThesisSchema = {
  //       id: item.key,
  //       title: item.data.title,
  //       language: item.data.language,
  //       abstract: item.data.abstractNote,
  //       thesisType: item.data.thesisType,

  //       year: Number((item.data.date as string)?.substring(0, 4)),
  //       publisher: item.data.publisher || item.data.university,
  //       url: item.data.url,
  //       author: {
  //         familyName: item.data.creators[0]?.lastName,
  //         givenName: item.data.creators[0]?.firstName
  //       },
  //       tags: item.data.tags.map(({ tag }: { tag: string }) => tag),
  //       organizations__organizationsId: [],
  //       facilities__facilityId: []
  //     }

  //     if (item.data.url?.startsWith("https://doi.org/")) {
  //       dataItem.doi = item.data.url.replace("https://doi.org/", "")
  //     }
  //     if (item.data.url?.startsWith("https://nbn-resolving.de/")) {
  //       dataItem.urn = item.data.url.replace("https://nbn-resolving.de/", "")
  //     }

  //     if (item.data.extra)
  //       item.data.extra.split("\n").forEach((extraLine: string) => {
  //         const splittedExtraLine = extraLine.split(/: /)
  //         if (
  //           splittedExtraLine.length == 2 &&
  //           splittedExtraLine[0] &&
  //           splittedExtraLine[0].toLowerCase() === "doi"
  //         ) {
  //           dataItem.doi = splittedExtraLine[1]
  //         } else if (
  //           splittedExtraLine.length == 2 &&
  //           splittedExtraLine[0] &&
  //           splittedExtraLine[0].toLowerCase() === "isbn"
  //         ) {
  //           dataItem.isbn = splittedExtraLine[1]
  //         } else if (
  //           splittedExtraLine.length == 2 &&
  //           splittedExtraLine[0] &&
  //           splittedExtraLine[0].toLowerCase() === "citation key"
  //         ) {
  //           dataItem.citationKey = splittedExtraLine[1]
  //         } else if (
  //           splittedExtraLine.length == 2 &&
  //           splittedExtraLine[0] &&
  //           splittedExtraLine[0].toLowerCase() === "fulltext-url" &&
  //           splittedExtraLine[1] !== "none"
  //         ) {
  //           dataItem.fulltextLink = splittedExtraLine[1]
  //         }
  //       })

  //     dataItem.tags.forEach(async (tag = "") => {
  //       if (tag?.startsWith("#academic-degree/doctoral-degree/:dr.rer.nat.")) {
  //         dataItem.isA_taxonId = "/academic-degree/doctoral-degree/:dr.rer.nat."
  //       } else if (
  //         tag?.startsWith("#academic-degree/doctoral-degree/:dr.ing.")
  //       ) {
  //         dataItem.isA_taxonId = "/academic-degree/doctoral-degree/:dr.ing."
  //       }

  //       if (tag?.startsWith("#befidesh/02-organization/")) {
  //         const organizationId = tag.replace("#befidesh/02-organization/", "")

  //         dataItem.organizations__organizationsId.push(organizationId)

  //         if (UNIVERSITY_IDS.indexOf(organizationId) > -1) {
  //           dataItem.university__organizationsId = organizationId
  //         }
  //       }
  //       if (tag?.startsWith("#person/gender/")) {
  //         dataItem.author.gender = tag.replace("#person/gender/", "")
  //       }
  //       if (tag?.startsWith("#befidesh/facility/")) {
  //         dataItem.facilities__facilityId.push(
  //           tag.replace("#befidesh/facility/", "")
  //         )
  //       }
  //     })
  //     console.log(dataItem)

  //     return dataItem
  //   })
  // },
  schema: ThesisZodSchema,
})
