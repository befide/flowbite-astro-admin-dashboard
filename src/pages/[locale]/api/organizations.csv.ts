import { organizationsForAPI } from "@domain/organizations";
import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { json2csv } from "csv42";
import { formatValue } from "@/pages/[locale]/api/community.csv.ts";

export const getStaticPaths = (async () => {
  const locales = ["en", "de"];

  return locales.map((locale) => ({
    params: { locale },
    props: { locale },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  type Props = InferGetStaticPropsType<typeof getStaticPaths>;
  const { locale } = props as Props;

  const organizations = await organizationsForAPI(locale);

  try {
    return new Response(json2csv(organizations, { formatValue }));
  } catch (e) {
    throw new Error("Something went wrong in json-resource.json route: " + e);
  }
};
