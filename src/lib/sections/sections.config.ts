import {defineCollection, z} from "astro:content";
import {globWithParser} from "@/lib/globWithParser.ts";

import spaceCommander from "@/lib/space-commander.ts";
import { mergeDeep } from "../mergeDeep";

const SectionZodSchema = z.object({
  title: z.string().max(60),
  description: z
    .string()
    .optional()
    .transform((d) => spaceCommander(d)),
  sectionNumber: z.string(),
  sectionDepth: z.number(),
  sectionNumbers: z.array(z.string()),
  excludeFromTour: z.boolean().default(false),
  // draft: z.boolean().default(false)
  // publishDate: z.coerce.date().optional(),
  // updatedDate: z.coerce.date().optional(),
  // tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
});

export type SectionSchema = z.infer<typeof SectionZodSchema>;

// Define docs collection

export const defineSectionCollection = defineCollection({
  loader: globWithParser({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/docs",
    // @ts-ignore
    parser: (entry) => {
      const sectionNumbers = entry.data.sectionNumber
        ? (entry.data.sectionNumber as string).split(".")
        : [];
      const sectionDepth = sectionNumbers.length;
      const slug = entry.id.replaceAll(/([0-9-]*)__/gm, "");

      const computedData = {
        sectionNumbers,
        sectionDepth,
        // slug,
      };
console.log(computedData)
      return mergeDeep(entry, {data: computedData});
    },
  }),

  schema: SectionZodSchema,
});
