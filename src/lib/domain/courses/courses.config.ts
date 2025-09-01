import {
  DomainObjectZodSchema,
  NullableLocalizedString,
  ReviewSchema,
} from "@lib/content.common.ts"
import { glob } from "astro/loaders"
import { defineCollection, z } from "astro:content"


export const CourseZodSchema = DomainObjectZodSchema.extend({
  title: NullableLocalizedString,
  teachingEvent__taxonomyId: z.string(),
  university__organizationsId: z.string(),
  semesters: z.array(z.string()),
  studyLevels__taxonomyId: z.array(z.string()),
  partOfProgrammesOfStudy: z.array(z.string()),
  languages: z.array(z.string()),
  objectives: NullableLocalizedString,
  contents: NullableLocalizedString,
  weeklySemesterHours: z.number(),
  links: z.object({
    homepage: NullableLocalizedString,
  }),
  review: ReviewSchema,
})

export const defineCoursesCollection = defineCollection({
  loader: glob({
    pattern: "**/*.(md|mdx)",
    base: "./src/content/domain/courses",
  }),
  schema: CourseZodSchema,
})


