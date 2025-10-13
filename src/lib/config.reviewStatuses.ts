const INPUT_FILENAME = "review-statuses.csv";

import { csv2json } from "csv42";
import { defineCollection, z } from "astro:content";
import { NullableLocalizedString, readInputFile } from "./content.common";

export const ReviewStatusSchema = z.object({
  id: z.string(),
  index: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
});

export const defineReviewStatusesCollection = defineCollection({
  loader: () => {
    const input = readInputFile(INPUT_FILENAME).toString();
    const data = csv2json<ReviewStatus>(input, {
      nested: true,
    });
    return data;
  },
  schema: ReviewStatusSchema,
});

export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;
