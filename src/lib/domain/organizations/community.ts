// import { getLocalizedValue } from "../../content.ts"
// import {allOrganizations} from "@lib/domain";
// import {getEntry} from "astro:content";
// import {flattenTreeNodes} from "@lib/content.tree.ts";
//
// export const communityForAPI = async (locale: string) => {
//   const communityOrganizations = await allOrganizations()
//
//   const roots = getOrganizationRoots(communityOrganizations)
//
//   const communityRoot = roots.find((root) => root.id === ":")
//   if (!communityRoot) return []
//
//   const newRoot = rollupUniquePeopleCountSum(communityRoot)
//
//   const i18n = await getEntry("i18n", locale)
//
//   const list = flattenTreeNodes([...newRoot.children])
//     .toSorted((a, b) => ascending(a.id, b.id))
//     .map((item) => ({
//       id: item.id,
//
//       depth: item.depth,
//       height: item.children.length,
//       parent__id: item.parent__id,
//
//       label__fullName: getLocalizedValue(item.data, "label.fullName", locale),
//       label__short: getLocalizedValue(item.data, "label.short", locale),
//       uniquePeopleCountRecursiveSum: item.data.uniquePeopleCountRecursiveSum,
//       befideOrganizationCategories: item.data.befideOrganizationCategories.map(
//         (c) => i18n?.data["organizationCategory.full." + c]
//       ),
//
//       instanceOf: item.data.isInstanceOf,
//       location__country__code: item.data.location?.country?.code,
//       location__city: item.data.location?.city,
//     }))
//
//   return list
// }
