import { allCommunityOrganizations, allCommunityTopLevelOrganizations, careerLevels, communityForAPI, disciplinaryProfessions, genders, Organization, organizationsForAPI } from "@domain/organizations"
import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro"
import fastCartesian from "fast-cartesian"
import { getValue } from "@lib/content.ts"
const peopleKeys = fastCartesian([[...careerLevels], [...disciplinaryProfessions], [...genders]]).map((p) => p.join("."))

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

  // const community = await communityForAPI(locale as "en" | "de")
  const organizations = await allCommunityOrganizations()

  const community = await Promise.all(organizations.filter((o) => o.id !== ":").map(async (organization) => await new Organization(organization.data)))

  const organizationNodes = community
    .filter((d) => d.id !== "community")
    .map((o: Organization) => {
      const subtype =
        o._data.instanceOfs__taxonomyID.indexOf("/g/organization/formal-organization") > -1
          ? "top-level"
          : o._data.instanceOfs__taxonomyID.indexOf("/g/organization/working-group") > -1
            ? "group"
            : o._data.partOfCommunityDegree === "partial"
              ? "intermediate-partial"
              : "intermediate-full"

      return {
        id: o._data.id,
        parent__id: o._data.parent__id ? o._data.parent__id : null,
        type: "org",
        sector: 0,
        subtype,
        topLevel__id: o._data.topLevel__id,
        partOfCommunityDegree: o._data.partOfCommunityDegree,
        isUniversity: o._data.instanceOfs__taxonomyID.indexOf("/g/organization/university") > -1,
        label: o._data.label.short.en || o._data.label.fullName.en,
      }
    })
  organizationNodes.sort((a, b) => (a.isUniversity ? -1 : 1) * a.label.localeCompare(b.label))
  organizationNodes
    .filter((d) => d.subtype === "top-level")
    .forEach((d, i) => {
      d.sector = i
    })

  const peopleNodes = community
    .flatMap((o: Organization) => {
      return peopleKeys
        .filter((p) => getValue(o._data.uniquePeopleCount, p) > 0)
        .flatMap((p) => new Array(getValue(o._data.uniquePeopleCount, p)).fill(p).map((d) => ({ group: o._data.id, affiliation: o._data.topLevel__id, type: "person", subtype: p })))
    })
    .map((d, i) => ({ ...d, id: "p-" + i }))

  const groupLinks = peopleNodes.map((p) => ({ source: p.id, target: p.group, subtype: p.subtype, type: "group-member" }))
  const affiliationLinks = peopleNodes.map((p) => ({ source: p.id, target: "community/" + p.affiliation, type: "has-affiliation" }))

  const organizationLinks = community
    .filter((d) => d._data.parent__id && d._data.parent__id !== "community")
    .map((o: Organization) => ({
      source: o._data.id,
      target: o._data.parent__id,
      type: "has-parent",
    }))

  const graph = {
    nodes: [...organizationNodes, ...peopleNodes],
    links: [...organizationLinks, ...groupLinks],
  }

  try {
    return new Response(JSON.stringify(graph, null, 2))
  } catch (e) {
    throw new Error("Something went wrong in json-resource.json route: " + e)
  }
}
