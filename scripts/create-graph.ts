import { createFormatValue, csv2json, json2csv } from "csv42"
import fs from "fs"
import path from "path"
import YAML from "yaml"
import { getRoots } from "@lib/content.tree.ts"

export const genders = ["female", "male", "nonbinary"]
const careerLevels = ["professor", "seniorResearcher", "postDoc", "phdStudent", "masterStudent", "bachelorStudent"]
const disciplinaryProfessions = ["physicist", "engineer", "other"]
const peopleCountDiscriminators = [...careerLevels, ...disciplinaryProfessions, ...genders]
const __dirname = import.meta.dirname

// export function _slug(d: string) {
//   return d ? d.replaceAll("b:", "b/").replaceAll("g:", "g/") : null
//   return d ? d.toLowerCase().replaceAll("ä", "ae").replaceAll("ö", "oe").replaceAll("ü", "ue").replaceAll(":", "!").replaceAll("/", "___").replaceAll(".", "__").replaceAll(" ", "-").trim() : null
// }
export function slugify(d: string) {
  return d ? d.toLowerCase().replaceAll("ä", "ae").replaceAll("ö", "oe").replaceAll("ü", "ue").replaceAll(":", "!").replaceAll("/", "___").replaceAll(".", "__").replaceAll(" ", "-").trim() : null
}

function stringToArray(d = "") {
  return d ? d.split(/\s?,\s?/).filter((d) => !!d) : []
}

async function doTable(collectionKey: "review-statuses" | "contacts" | "organizations" | "taxonomy-items" | "facilities" | "courses", tableId: string, idMapper: any, mapper: any, postprocess?: any) {
  const contentFolder = path.join(__dirname, "../src/content/domain/", collectionKey)
  const gristFolder = path.join(__dirname, "../src/data/grist")
  fs.rmSync(contentFolder, { recursive: true, force: true })
  fs.mkdirSync(contentFolder, { recursive: true })
  fs.mkdirSync(gristFolder, { recursive: true })

  const data = await fetch("https://befide.getgrist.com/api/docs/vGtqDxisUdjkKYGmpzAkDj/download/csv?tableId=" + tableId, {
    headers: {
      accept: "text/csv",
      Authorization: "Bearer 839145cf5a7092364d1df58b0908952403ad9657",
    },
  })
    .then((response) => response.text())
    .then((data) => {
      fs.writeFileSync(path.join(gristFolder, "raw", tableId + ".csv"), data)
      return csv2json(data, { nested: true })
    })
    .catch((error) => console.error("Error:", error))

  if (postprocess) postprocess(data)

  const csvResult: any[] = []

  data &&
    data.forEach((d: any) => {
      // const id = idMapper(d)
      // console.log(d)
      const frontmatter = { ...mapper(d) }
      const fileFolder = path.join(contentFolder, frontmatter.id)

      fs.mkdirSync(fileFolder, { recursive: true })
      const filePath = path.join(fileFolder, "index.mdx")

      if (frontmatter.id.length < 240) {
        const markdown = "---\n" + YAML.stringify(frontmatter) + "---\n"

        console.debug("writing file: " + filePath)
        fs.writeFileSync(filePath, markdown)

        csvResult.push(frontmatter)
      } else {
        console.error("filename too long:", frontmatter.id)
      }
    })

  function formatValue(value: unknown): string {
    return Array.isArray(value) ? createFormatValue(",")(value.join(",")) : createFormatValue(",")(value)
  }

  if (Array.isArray(data)) {
    const csvFilePath = path.join(gristFolder, collectionKey + ".csv")
    fs.writeFileSync(csvFilePath, json2csv(csvResult, { formatValue }))
  }

  return csvResult
}

const courseIdGenerator = ({ university__organizationsId, title }: { university__organizationsId: string; title: { de: string; en: string } }) => university__organizationsId + "/" + slugify(title.de)

const doReviewStatuses = async () =>
  await doTable(
    "review-statuses",
    "Review_Statuses",
    (d: any) => d.id,
    (d: any) => d,
  )

const doContacts = async () =>
  await doTable(
    "contacts",
    "Contacts",
    (d: any) => d.id,
    (d: any) => ({
      id: d.id,
      oricid: d.oricid,
      familyName: d.familyName,
      givenName: d.givenName,
      academicTitle: d.academicTitle,
      emailAddress: d.emailAddress,
      hasAffiliation__organizationId: d.hasAffiliation__organizationId,
      hasAssociatedAffiliation__organizationIDs: stringToArray(d.hasAssociatedAffiliation__organizationIDs),
      isHeadOf__organizationIDs: stringToArray(d.isHeadOf__organizationIDs),
      gender: d.gender,
    }),
  )

const doCourses = async () =>
  await doTable(
    "courses",
    "Teaching_offers",
    (d) => courseIdGenerator(d),
    (d: any) => ({
      id: courseIdGenerator(d),
      teachingEvent__taxonomyId: d.teachingEvent__taxonomyId,
      university__organizationsId: d.university__organizationsId,
      studyLevels__taxonomyId: stringToArray(d.studyLevels__taxonomyId),
      weeklySemesterHours: d.weeklySemesterHours,
      semesters: stringToArray(d.semesters),
      title: d.title,
      objectives: d.objectives,
      contents: d.contents,
      languages: stringToArray(d.languages),
      partOfProgrammesOfStudy: stringToArray(d.partOfProgrammesOfStudy),
      links: d.links,
      review: d.review,
    }),
  )

const doTaxonomy = async () =>
  await doTable(
    "taxonomy-items",
    "Taxonomy_items",
    (d: any) => d.id,
    (d: any) => ({
      id: d.id,
      parent__id: !d.parent__id ? null : d.id.split("/").slice(0, -1).join("/"),
      term: d.term,
      definition: d.definition,
      abbreviations: {
        en: stringToArray(d.abbreviations.en),
        de: stringToArray(d.abbreviations.de),
      },
      synonyms: {
        en: stringToArray(d.synonyms.en),
        de: stringToArray(d.synonyms.de),
      },
      iris: stringToArray(d.iris),
      taxonomyURI: d.taxonomyURI,
      review: d.review,
    }),
  )

const doOrganizations = async () =>
  await doTable(
    "organizations",
    "Organizations",
    (d: any) => d.id,

    (d: any) => {
      const classes = stringToArray(d.instanceOf__taxonomyIDs)
      return {
        id: d.id,
        parent__id: d.parent__id,
        topLevel__id: d.topLevel__id,
        partOfCommunityDegree: d.partOfCommunityDegree,
        instanceOfs__taxonomyID: classes,
        isFormalOrganization: classes.filter((d) => d === "g/organization/formal-organization").length > 0,
        isResearchInstitution: classes.filter((d) => d === "g/organization/research-institution").length > 0,
        isUniversity: classes.filter((d) => d === "g/organization/university").length > 0,
        isWorkingGroup: classes.filter((d) => d === "g/organization/working-group").length > 0,
        isDepartment: classes.filter((d) => d === "g/organization/formal-organization/department" || d === "g/organization/formal-organization/sub-department").length > 0,
        befideOrganizationCategories: stringToArray(d.befideOrganizationCategories),
        label: d.label,
        tagline: d.tagline,
        description: d.description,
        hasHeads: {
          literal: stringToArray(d.hasHeads.literal),
          contact__contactsIDs: stringToArray(d.hasHeads?.contact__contactIds),
        },
        location: d.location,
        links: d.links,
        uniquePeopleCount: d.uniquePeopleCount,
        uniquePeopleCountSum: d.uniquePeopleCountSum,
        uniquePeopleCountRecursiveSum: d.uniquePeopleCountRecursiveSum,
        review: d.review,
      }
    },
    (data: any[]) => {
      const communityOrganizations = data.filter((d: { partOfCommunityDegree: any; befideOrganizationCategories: string | string[] }) => d.partOfCommunityDegree !== "none" && d.befideOrganizationCategories.indexOf("committee") !== 0)
      const roots = getRoots(communityOrganizations)
      const rolledUpNode = rollupUniquePeopleCountSum(roots[0])
      console.log(rolledUpNode)
      return rolledUpNode
    },
  )

const doFacilities = async () =>
  await doTable(
    "facilities",
    "Facilities",
    (d) => d.id,
    (d: {
      id: any
      instanceOf__taxonomyId: any
      partOf__id: any
      host__organizationsId: any
      successorOf__id: any
      isUserFacility: any
      isBMBF_FIS: any
      label: any
      tagLine: any
      definition: any
      primaryApplications__taxonomyId: string | undefined
      secondaryApplications__taxonomyId: string | undefined
      lifeCycle: any
      parameters: {
        primaryBeamParticles: string | undefined
        secondaryBeamParticles: string | undefined
      }
      links: any
      references: string | undefined
      review: any
    }) => ({
      id: d.id,
      instanceOf__taxonomyId: d.instanceOf__taxonomyId,
      partOf__id: d.partOf__id,
      host__organizationsId: d.host__organizationsId,
      successorOf__id: d.successorOf__id,
      parent__id: d.partOf__id || d.successorOf__id,
      isUserFacility: d.isUserFacility,
      isBMBF_FIS: d.isBMBF_FIS,
      label: d.label,
      tagLine: d.tagLine,
      definition: d.definition,
      primaryApplications__taxonomyId: stringToArray(d.primaryApplications__taxonomyId),
      secondaryApplications__taxonomyId: stringToArray(d.secondaryApplications__taxonomyId),
      lifeCycle: d.lifeCycle,
      parameters: {
        ...d.parameters,
        primaryBeamParticles: stringToArray(d.parameters?.primaryBeamParticles),
        secondaryBeamParticles: stringToArray(d.parameters?.secondaryBeamParticles),
      },
      links: d.links,
      references: stringToArray(d.references),
      review: d.review,
    }),
  )

function getValue(obj: any, path: string) {
  const pathParts = path.split(".")
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i]! in obj) obj = obj[pathParts[i]!]
    else return
  }
  return obj
}

function rollupUniquePeopleCountSum(node: any) {
  if (node.children.length === 0) {
    node.data.uniquePeopleCountRecursiveSum = {
      total: node.data.uniquePeopleCountSum.total,
      ...Object.fromEntries(peopleCountDiscriminators.map((d) => [d, getValue(node.data.uniquePeopleCountSum, d)])),
    }
  } else {
    node.children.forEach((child: any) => rollupUniquePeopleCountSum(child))
    node.data.uniquePeopleCountRecursiveSum = {
      total: node.children.reduce(
        (
          sum: any,
          child: {
            data: { uniquePeopleCountRecursiveSum: any }
          },
        ) => sum + getValue(child.data.uniquePeopleCountRecursiveSum, "total"),
        getValue(node.data.uniquePeopleCountSum, "total"),
      ),
      ...Object.fromEntries(
        peopleCountDiscriminators.map((d) => [
          d,
          node.children.reduce(
            (
              sum: any,
              child: {
                data: { uniquePeopleCountRecursiveSum: any }
              },
            ) => sum + getValue(child.data.uniquePeopleCountRecursiveSum, d),
            getValue(node.data.uniquePeopleCountSum, d),
          ),
        ]),
      ),
    }
  }

  return node
}
//
const rewviewStatuses = await doReviewStatuses()
const contacts = await doContacts()
const organisations = await doOrganizations()
const taxonomyItems = await doTaxonomy()
const facilities = await doFacilities()
const courses = await doCourses()
