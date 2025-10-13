import { defineCollection, z } from "astro:content";
import { globWithParser } from "@/lib/globWithParser.ts";

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
  excludeFromLinearNavigation: z.boolean().default(false),
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

      const computedData = {
        sectionNumbers,
        sectionDepth,
        // slug,
      };
      // console.log(computedData)
      return mergeDeep(entry, { data: computedData });
    },
  }),

  schema: SectionZodSchema,
});
