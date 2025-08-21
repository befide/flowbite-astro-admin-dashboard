import { defineCollection, z } from "astro:content";
import { globWithParser } from "@/lib/globWithParser.ts";

import spaceCommander from "@/lib/space-commander.ts";

const SectionZodSchema = z.object({
  title: z.string().max(60),
  description: z.string().optional().transform( (d) => spaceCommander(d)),
  sectionNumber: z.string(),
  sectionDepth: z.number(),
  sectionNumbers: z.array(z.string()),
  // description: z.string().max(160).optional(),
  // publishDate: z.coerce.date().optional(),
  // updatedDate: z.coerce.date().optional(),
  // tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
  // draft: z.boolean().default(false)
});

export type SectionSchema = z.infer<typeof SectionZodSchema>;

// Define docs collection
export const defineSectionCollection = defineCollection({
  loader: globWithParser({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/docs",
    parser: (entry) => {


      entry.data.sectionNumbers = entry.data.sectionNumber
        ? (entry.data.sectionNumber as string).split(".")
        : [];
      entry.data.sectionDepth = entry.data.sectionNumbers.length;
      entry.data.slug = entry.id.replaceAll(/([0-9-]*)__/gm, "");

      console.log(entry.data);
      return entry;
    },
  }),

  schema: SectionZodSchema,
});
