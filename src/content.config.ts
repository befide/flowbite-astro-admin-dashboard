import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

function removeDupsAndLowerCase(array: string[]) {
  if (!array.length) return array
  const lowercaseItems = array.map((str) => str.toLowerCase())
  const distinctItems = new Set(lowercaseItems)
  return Array.from(distinctItems)
}

// Define docs collection
const docs = defineCollection({
  loader: glob({ base: "./src/content/docs", pattern: "**/*.{md,mdx}" }),
  schema: () =>
    z.object({
      title: z.string().max(60),
      sectionNumber: z.string().optional(),
      // description: z.string().max(160).optional(),
      // publishDate: z.coerce.date().optional(),
      // updatedDate: z.coerce.date().optional(),
      // tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      // draft: z.boolean().default(false),
      // Special fields
      order: z.number().default(999),
    }),
})

export const collections = {  docs }
