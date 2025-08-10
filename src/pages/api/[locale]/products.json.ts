import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro"
import * as operations from "../../../services/index.js"

export const getStaticPaths = (async () => {
  const locales = ["en", "de"]

  return locales.map((locale) => ({
    params: { locale },
    props: { locale },
  }))
}) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) => {
  // type Props = InferGetStaticPropsType<typeof getStaticPaths>
  // const { locale } = props as Props

  const community = await operations.getProducts()

  try {
    return new Response(JSON.stringify(community, null, 2))
  } catch (e) {
    throw new Error("Something went wrong in json-resource.json route: " + e)
  }
}
