import { getCollection } from "astro:content"
import { Organization } from "./organization.ts"

export const allOrganizations = async () => (await getCollection("organizations")).map(({ data }) => data)

export const allOrganizationsForTopLevelOrganization = async (topLevel__id: string) => {
  return await getCollection("organizations", ({ data, id }) => topLevel__id === undefined || data.topLevel__id === topLevel__id || id === topLevel__id || id === ":")
}

export const allCommunityTopLevelOrganizations = async () => await getCollection("organizations", (entry) => entry.data.partOfCommunityDegree !== "none" && entry.data.parent__id === "community/" && entry.data.category !== "committee")

export const allCommunityOrganizations = async () => await getCollection("organizations", (entry) => entry.data.partOfCommunityDegree !== "none" && entry.data.category !== "committee")

export const getOrganizationCategories = async () => Array.from(new Set((await allCommunityTopLevelOrganizations()).flatMap((entry) => entry.data.category)))

export const organizationsForAPI = async (locale: "en" | "de") => {
  const organizations = await allCommunityTopLevelOrganizations()

  return await Promise.all(organizations.filter((o) => o.id !== ":").map(async (organization) => await new Organization(organization.data).getDto(locale)))
}
export const communityForAPI = async (locale: string) => {
  const organizations = await allCommunityOrganizations()

  return await Promise.all(organizations.filter((o) => o.id !== ":").map(async (organization) => await new Organization(organization.data).getDto(locale)))
}
