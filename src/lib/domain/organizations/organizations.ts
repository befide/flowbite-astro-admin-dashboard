import { getCollection } from "astro:content"
import { Organization } from "./organization.ts"

export const allOrganizations = async () =>
  (await getCollection("organizations")).map(({ data }) => data)

export const allOrganizationsForTopLevelOrganization = async (
  topLevel__id: string
) => {
  return await getCollection(
    "organizations",
    ({ data, id }) =>
      topLevel__id === undefined ||
      data.topLevel__id === topLevel__id ||
      id === topLevel__id ||
      id === ":"
  )
}

export const allCommunityTopLevelOrganizations = async () =>
  await getCollection(
    "organizations",
    (entry) =>
      entry.data.isPartOfCommunity &&
      entry.data.parent__id &&
      !entry.data.topLevel__id &&
      entry.data.befideOrganizationCategories.indexOf("committee") !== 0
  )

export const allCommunityOrganizations = async () =>
  await getCollection(
    "organizations",
    (entry) =>
      entry.data.isPartOfCommunity &&
      entry.data.befideOrganizationCategories.indexOf("committee") !== 0
  )

export const getOrganizationCategories = async () =>
  Array.from(
    new Set(
      (await allCommunityTopLevelOrganizations()).flatMap(
        (entry) => entry.data.befideOrganizationCategories
      )
    )
  )

export const organizationsForAPI = async (locale: string) => {
  const organizations = await allCommunityTopLevelOrganizations()

  return await Promise.all(
    organizations
      .filter((o) => o.id !== ":")
      .map(
        async (organization) =>
          await new Organization(organization.data).getDto(locale)
      )
  )
}
export const communityForAPI = async (locale: string) => {
  const organizations = await allCommunityOrganizations()

  return await Promise.all(
    organizations
      .filter((o) => o.id !== ":")
      .map(
        async (organization) =>
          await new Organization(organization.data).getDto(locale)
      )
  )
}
