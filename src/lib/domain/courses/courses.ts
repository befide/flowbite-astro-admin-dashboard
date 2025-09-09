import {
  getCollection,
  type CollectionEntry,
} from "astro:content"
import { ascending } from "d3"
import { Course } from "./course.ts"
import type { CourseDto, CourseSchema } from "@lib/common"

// export const getCourses = async (universityId?: string) =>
//   (
//     await getCollection(
//       "courses",
//       (entry) =>
//         universityId === undefined ||
//         entry.data.university__organizationsId === universityId
//     )
//   ).sort((a, b) => ascending(a.id, b.id))

export async function allCoursesData(): Promise<
  CourseSchema[]
> {
  return (await getCollection("courses"))
    .map((d: CollectionEntry<"courses">) => d.data)
    .sort((a: CourseSchema, b: CourseSchema) =>
      ascending(a.id, b.id),
    )
}

export async function coursesForAPI(
  locale = "en",
): Promise<CourseDto[]> {
  const courses = await allCoursesData()

  return await Promise.all(
    courses.map(
      async (course) =>
        await new Course(course).getDto(locale),
    ),
  )
}
