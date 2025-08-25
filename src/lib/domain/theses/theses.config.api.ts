import fs from "node:fs"
import path from "node:path"

import { defineCollection, z } from "astro:content"
import { DomainObjectZodSchema } from "@lib/content.common.ts"

const INPUT_FILEPATH = path.join("src", "data", "zotero", "kfb_theses.json")

// const UNIVERSITY_IDS = [
//   "hu-berlin",
//   "kit",
//   "rwth-aachen",
//   "tu-berlin",
//   "tu-darmstadt",
//   "tu-dortmund",
//   "tu-dresden",
//   "uni-bonn",
//   "uni-duesseldorf",
//   "uni-erlangen",
//   "uni-frankfurt",
//   "uni-goettingen",
//   "uni-hamburg",
//   "uni-jena",
//   "uni-kassel",
//   "uni-mainz",
//   "uni-rostock",
//   "uni-siegen",
//   "uni-wuppertal",
// ]

export const ThesisZodSchema = DomainObjectZodSchema.extend({
  id: z.string(),
  citationKey: z.string(),
  author: z.object({
    familyName: z.string(),
    givenName: z.string(),
    gender: z.string().optional().nullable(),
  }),
  year: z.number(),
  title: z.string(),
  language: z.enum(["en", "de"]),
  url: z.string().url().optional(),
  thesisType: z.string(),
  fulltextLink: z.string().url().optional(),
  doi: z.string().optional(),
  urn: z.string().optional(),
  isbn: z.string().optional(),
  abstract: z.string().optional().nullable(),
  publisher: z.string(),
  tags: z.array(z.string().optional()),
  degree: z.object({
    title: z.string(),
    level: z.string(),
    grantedBy__organizationsId: z.string().optional(),
  }),
  employsMethod: z.string().optional(),
  hasAffiliation__organizationsId: z.array(z.string()), // z.array(reference("organizations").optional().nullable()),
  isAbout: z.object({
    facility__facilitiesId: z.array(z.string()),
    accelerationProcess__taxonomyId: z.array(z.string().optional()),
  }),
})

export type ThesisSchema = z.infer<typeof ThesisZodSchema>

export const defineThesesCollection = defineCollection({
  loader: async () => {
    const dataRaw = JSON.parse(fs.readFileSync(INPUT_FILEPATH).toString())

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataRaw.flat().map((item: any) => {
      const dataItem: ThesisSchema = {
        citationKey: item.data.citationKey,
        id: item.key,
        title: item.data.title,
        language: item.data.language,
        abstract: item.data.abstractNote,
        thesisType: item.data.thesisType,

        year: Number((item.data.date as string)?.substring(0, 4)),
        publisher: item.data.publisher || item.data.university,
        url: item.data.url,
        author: {
          familyName: item.data.creators[0]?.lastName,
          givenName: item.data.creators[0]?.firstName,
        },
        degree: {
          title: "",
          level: "doctoral",
        },
        tags: item.data.tags.map(({ tag }: { tag: string }) => tag),
        hasAffiliation__organizationsId: [],

        isAbout: {
          facility__facilitiesId: [],
          accelerationProcess__taxonomyId: [],
        },
      }

      if (item.data.url?.startsWith("https://doi.org/")) {
        dataItem.doi = item.data.url.replace("https://doi.org/", "")
      }
      if (item.data.url?.startsWith("https://nbn-resolving.de/")) {
        dataItem.urn = item.data.url.replace("https://nbn-resolving.de/", "")
      }

      if (item.data.extra)
        item.data.extra.split("\n").forEach((extraLine: string) => {
          const splittedExtraLine = extraLine.split(/: /)
          if (
            splittedExtraLine.length == 2 &&
            splittedExtraLine[0] &&
            splittedExtraLine[0].toLowerCase() === "doi"
          ) {
            dataItem.doi = splittedExtraLine[1]
          } else if (
            splittedExtraLine.length == 2 &&
            splittedExtraLine[0] &&
            splittedExtraLine[0].toLowerCase() === "isbn"
          ) {
            dataItem.isbn = splittedExtraLine[1]
          } else if (
            splittedExtraLine.length == 2 &&
            splittedExtraLine[0] &&
            splittedExtraLine[0].toLowerCase() === "citation key"
          ) {
            dataItem.citationKey = splittedExtraLine[1]
          } else if (
            splittedExtraLine.length == 2 &&
            splittedExtraLine[0] &&
            splittedExtraLine[0].toLowerCase() === "fulltext-url" &&
            splittedExtraLine[1] !== "none"
          ) {
            dataItem.fulltextLink = splittedExtraLine[1]
          }
        })

      dataItem.tags.forEach(async (tag = "") => {
        if (tag?.startsWith("#degree/title/:")) {
          dataItem.degree.title = tag.replace("#degree/title/:", "")
        }
        if (tag?.startsWith("#degree/granted-by/:")) {
          dataItem.degree.grantedBy__organizationsId = tag.replace(
            "#degree/granted-by/:",
            ""
          )
        }

        if (tag?.startsWith("#has-affiliation/:")) {
          const organizationId = tag.replace("#has-affiliation/:", "")
          dataItem.hasAffiliation__organizationsId.push(organizationId)
        }
        if (tag?.startsWith("#author/gender/:")) {
          dataItem.author.gender = tag.replace("#author/gender/:", "")
        }
        if (tag?.startsWith("#is-about/facility/:")) {
          dataItem.isAbout.facility__facilitiesId.push(
            tag.replace("#is-about/facility/:", "")
          )
        }
        if (tag?.startsWith("#is-about/acceleration-process/:")) {
          dataItem.isAbout.accelerationProcess__taxonomyId.push(
            tag.replace("#is-about/acceleration-process/:", "")
          )
        }
      })

      return dataItem
    })
  },
  schema: ThesisZodSchema,
})
