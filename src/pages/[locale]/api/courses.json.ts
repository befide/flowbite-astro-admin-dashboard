import { coursesForAPI } from "@domain/courses"
import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro"

export const getStaticPaths = (async () => {
  const locales = ["en", "de"]

  return locales.map((locale) => ({
    params: { locale },
    props: { locale },
  }))
}) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) => {
  type Props = InferGetStaticPropsType<typeof getStaticPaths>
  const { locale } = props as Props

  const courses = await coursesForAPI(locale)
  try {
    return new Response(JSON.stringify(courses, null, 2))
  } catch (e) {
    throw new Error("Something went wrong in json-resource.json route: " + e)
  }
}
