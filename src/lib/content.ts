/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type CollectionEntry,
  type CollectionKey,
  getEntry,
} from "astro:content";

export function getValue(obj: any, path: string) {
  const pathParts = path.split(".");
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i]! in obj) obj = obj[pathParts[i]!];
    else return;
  }
  return obj;
}

export function getLocalizedValue(obj: any, path: string, locale = "en") {
  if (!obj) {
    return obj as string;
  }

  const pathParts = (path + "." + locale).split(".");
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i]! in obj) obj = obj[pathParts[i]!];
    else return obj as string;
  }
  return obj as string;
}

export async function getReference(collection: CollectionKey, id: string) {
  return await getEntry(collection, id);
}

export async function getReferenceLocalizedValue(
  collection: CollectionKey,
  id: string,
  path: string,
  locale: string = "en",
) {
  return getLocalizedValue(await getReference(collection, id), path, locale);
}

export async function getReferences(collection: CollectionKey, ids: string[]) {
  return (
    await Promise.all(
      ids.map(async (id: string) => await getEntry(collection, id)),
    )
  ).filter((item: unknown) => !!item);
}

export const getTaxonomyReferenceTerm = async (id: string, locale: string) =>
  id ? (await getTaxonomyReferencesTerm([id], locale)).pop() : null;

export const getTaxonomyReferencesTerm = async (
  ids: string[] = [],
  locale = "en",
) => {
  const unLeadingSlashIds = ids.map((id) => id.replace(/^\/+/, ""));

  return (
    (await Promise.all(
      unLeadingSlashIds
        .map((d) => d)
        .map(async (d) => {
          return await getEntry("taxonomyItems", d);
        }),
    )) as CollectionEntry<"taxonomyItems">[]
  )
    .filter((taxon: CollectionEntry<"taxonomyItems">) => !!taxon)
    .map((taxon: CollectionEntry<"taxonomyItems">) =>
      getLocalizedValue(taxon, "data.term", locale),
    );
};

export const getOrganizationsReferencesShortLabel = async (
  ids: string[],
  locale = "en",
) =>
  (
    (await Promise.all(
      ids.map(async (d) => await getEntry("organizations", d)),
    )) as CollectionEntry<"organizations">[]
  )
    .filter((taxon: CollectionEntry<"organizations">) => !!taxon)
    .map((taxon: CollectionEntry<"organizations">) =>
      getLocalizedValue(taxon, "data.label.short", locale),
    );

export const getFacilitiesReferencesLabel = async (
  ids: string[],
  locale = "en",
) =>
  (
    (await Promise.all(
      ids.map(async (d) => await getEntry("facilities", d)),
    )) as CollectionEntry<"facilities">[]
  )
    .filter((taxon: CollectionEntry<"facilities">) => !!taxon)
    .map((taxon: CollectionEntry<"facilities">) =>
      getLocalizedValue(taxon, "data.label", locale),
    );
