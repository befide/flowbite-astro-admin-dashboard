
import { defineSectionCollection } from "@/lib/sections";


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

export const collections = { sections: defineSectionCollection };
