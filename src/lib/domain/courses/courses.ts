import { getCollection } from "astro:content"
import { ascending } from "d3"
import { Course, type CourseDto } from "./course.ts"

export const getCourses = async (universityId?: string) =>
  (
    await getCollection(
      "courses",
      (entry) =>
        universityId === undefined ||
        entry.data.university__organizationsId === universityId
    )
  ).sort((a, b) => ascending(a.id, b.id))

export const allCourses = async () => await getCollection("courses")

export async function coursesForAPI(locale = "en"): Promise<CourseDto[]> {
  const theses = await allCourses()

  return await Promise.all(
    theses.map(async (course) => await new Course(course.data).getDto(locale))
  )
}
