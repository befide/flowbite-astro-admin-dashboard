import { communityForAPI } from "@domain/organizations"
import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro"
import { createFormatValue, json2csv } from "csv42"

export function formatValue(value: unknown): string {
  return Array.isArray(value) ? createFormatValue(",")(value.join(",")) : createFormatValue(",")(value)
}

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

  const community = await communityForAPI(locale)

  try {
    return new Response(json2csv(community, { formatValue }))
  } catch (e) {
    throw new Error("Something went wrong in json-resource.json route: " + e)
  }
}
