import { defineSectionCollection } from "@/lib/sections";
import {
  type CourseSchema, type FacilitySchema, type OrganizationSchema, type TaxonomyItemSchema, type ThesisSchema
} from "@lib/common.d";
import {defineReviewStatusesCollection} from "@lib/config.reviewStatuses.ts";
import {
  defineCoursesCollection,
  defineFacilityCollection,
  defineOrganizationCollection, defineReferencesCollection,
  defineTaxonomyItemsCollection, defineThesesCollection
} from "@lib/domain";

// import { pocketbaseLoader } from "astro-loader-pocketbase"

// function removeDupsAndLowerCase(array: string[]) {
//   if (!array.length) return array
//   const lowercaseItems = array.map((str) => str.toLowerCase())
//   const distinctItems = new Set(lowercaseItems)
//   return Array.from(distinctItems)
// }

// const taxonomy = defineCollection({
//   loader: pocketbaseLoader({
//      url: "https://bit-kitchen.pockethost.io/",
//     collectionName: "taxonomy",
// 		 updatedField: "updated",
// 		  superuserCredentials: {

// 			// or
//       impersonateToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc1NTYwNjEyMCwiaWQiOiJqOWw1dDNwZjZhZmw5ZmoiLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.MsJflRCHAabdY0aQx79yrTUCCPAww7hPEbCyLGeN0iI"
//     }
//   })
// });

export type DomainObject =
  | CourseSchema
  | OrganizationSchema
  | TaxonomyItemSchema
  | FacilitySchema
  | ThesisSchema


export const collections = {
  reviewStatuses: defineReviewStatusesCollection,
  taxonomyItems: defineTaxonomyItemsCollection,
  organizations: defineOrganizationCollection,
  facilities: defineFacilityCollection,
  courses: defineCoursesCollection,
  theses: defineThesesCollection,
  references: defineReferencesCollection,
  sections: defineSectionCollection };
