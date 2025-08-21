import type { APIRoute, GetStaticPaths } from "astro";

import { getCollection } from "astro:content";

export const getStaticPaths = (async () => {
  const locales = ["en", "de"];

  return locales.map((locale) => ({
    params: { locale },
    props: { locale },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  // type Props = InferGetStaticPropsType<typeof getStaticPaths>
  // const { locale } = props as Props

  const taxonomy = await getCollection("taxonomy");

  try {
    return new Response(JSON.stringify(taxonomy, null, 2));
  } catch (e) {
    throw new Error("Something went wrong in json-resource.json route: " + e);
  }
};
