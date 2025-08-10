import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"
import { pocketbaseLoader } from "astro-loader-pocketbase"

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

const taxonomy = defineCollection({
  loader: pocketbaseLoader({
     url: "https://bit-kitchen.pockethost.io/",
    collectionName: "taxonomy",
		 updatedField: "updated",
		  superuserCredentials: {
      
			// or
      impersonateToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc1NDg5NDQxMywiaWQiOiJqOWw1dDNwZjZhZmw5ZmoiLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.i6ACAx1WtacsoaRTu0IQN7rsw_UU4LNsbl6BrS0v0Lw"
    }
  })
});

export const collections = { docs, taxonomy}



