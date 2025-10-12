import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import {
  Locales,
  LocalizedString,
  NullableLocalizedString,
  ReviewZodSchema,
} from "@lib/content.common.ts";
import { NestableDomainObjectZodSchema } from "@lib/content.common.ts";

const TaxonomyItemZodSchema = NestableDomainObjectZodSchema.extend({
  taxonomyURI: z.string().nullable(),
  term: LocalizedString,
  definition: NullableLocalizedString,
  abbreviations: z.record(Locales, z.array(z.string())),
  synonyms: z.record(Locales, z.array(z.string())),
  iris: z.array(z.string()),
  review: ReviewZodSchema,
});

export type TaxonomyItemSchema = z.infer<typeof TaxonomyItemZodSchema>;

export const defineTaxonomyItemsCollection = defineCollection({
  loader: glob({
    pattern: "**/*.(md|mdx)",
    base: "./src/content/domain/taxonomy-items",
  }),

  schema: TaxonomyItemZodSchema,
});
