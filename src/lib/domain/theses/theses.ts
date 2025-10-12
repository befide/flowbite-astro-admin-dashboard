import { getCollection } from "astro:content";
import { ascending, descending } from "d3";
import { Thesis, type ThesisDto } from "./thesis.ts";

export const allTheses = async () =>
  (await getCollection("theses"))
    .sort((a, b) =>
      ascending(a.data.author.familyName, b.data.author.familyName),
    )
    .sort((a, b) => descending(a.data.year, b.data.year));

export async function thesesForeAPI(locale = "en"): Promise<ThesisDto[]> {
  const theses = await allTheses();

  return await Promise.all(
    theses.map(async (thesis) => await new Thesis(thesis.data).getDto(locale)),
  );
}

export const allThesesForUniversity = async (universityId: string) =>
  (
    await getCollection(
      "theses",
      (entry) => entry.data.degree.grantedBy__organizationsId === universityId,
    )
  )
    .sort((a, b) =>
      ascending(a.data.author.familyName, b.data.author.familyName),
    )
    .sort((a, b) => descending(a.data.year, b.data.year));
