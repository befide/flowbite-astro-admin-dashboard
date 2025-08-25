/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "node:fs"
import path from "node:path"

import { defineCollection, reference, z } from "astro:content"

const INPUT_FILEPATH = path.join("src", "data", "zotero", "kfb_bf2035.json")

export const ReferenceZodSchema = z.object({
  id: z.string(),
  citationKey: z.string().optional(),
  creators: z.array(
    z.object({
      lastName: z.string().optional(),
      firstName: z.string().optional(),
      name: z.string().optional(),
    })
  ),
  itemType: z.string(),
  year: z.number().optional(),
  title: z.string(),
  language: z.enum(["en", "de"]).optional(),
  //   url: z.string().url().optional(),
  url: z.string().optional(),
  fulltextLink: z.string().url().optional(),
  doi: z.string().optional(),
  urn: z.string().optional(),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  tags: z.array(z.string().optional()),

  organizationRefs: z.array(reference("organizations").optional().nullable()),
  facilityRefs: z.array(reference("facilities").optional().nullable()),
})

export type ReferenceSchema = z.infer<typeof ReferenceZodSchema>

export const defineReferencesCollection = defineCollection({
  loader: async () => {
    const dataRaw = JSON.parse(fs.readFileSync(INPUT_FILEPATH).toString())

    return dataRaw
      .flat()
      .filter(
        (item: any) =>
          item.data.itemType !== "attachment" &&
          item.data.tags
            .map(({ tag }: { tag: string }) => tag)
            .indexOf("_used") > -1
      )
      .map((item: any) => {
        const dataItem: ReferenceSchema = {
          id: item.key,
          title: item.data.title,
          itemType: item.data.itemType,
          language: item.data.language !== "" ? item.data.language : undefined,
          year: item.data.date
            ? Number((item.data.date as string)?.substring(0, 4))
            : undefined,
          publisher: item.data.publisher || item.data.university,
          url: item.data.url !== "" ? item.data.url : undefined,
          creators: item.data.creators,
          tags: item.data.tags.map(({ tag }: { tag: string }) => tag),
          organizationRefs: [],
          facilityRefs: [],
        }

        if (item.data.url?.startsWith("https://doi.org/")) {
          dataItem.doi = item.data.url.replace("https://doi.org/", "")
        }
        if (item.data.url?.startsWith("https://nbn-resolving.de/")) {
          dataItem.urn = item.data.url.replace("https://nbn-resolving.de/", "")
        }

        return dataItem
      })
  },
  schema: ReferenceZodSchema,
})
