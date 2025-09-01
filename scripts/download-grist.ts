import { createFormatValue, csv2json, json2csv } from "csv42"
import fs from "fs"
import path from "path"
import YAML from "yaml"
import {getRoots} from "@lib/content.tree.ts";


export const genders = ["female", "male", "nonbinary"]
const careerLevels = [
  "professor",
  "seniorResearcher",
  "postDoc",
  "phdStudent",
  "masterStudent",
  "bachelorStudent",
]
const disciplinaryProfessions = ["physicist", "engineer", "other"]
const peopleCountDiscriminators = [
  ...careerLevels,
  ...disciplinaryProfessions,
  ...genders,
]
const __dirname = import.meta.dirname

function slug(d: string) {
  return d
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll(":", "!")
    .replaceAll("/", "__")
    .replaceAll(" ", "-")
    .trim()
}

function stringToArray(d = "") {
  return d ? d.split(/\s?,\s?/).filter((d) => !!d) : []
}

async function doTable(
  collectionKey: "organizations" | "taxonomy-items" | "facilities" | "courses",
  tableId: string,
  idMapper: {
    ({
      university__organizationsId,
      title,
    }: {
      university__organizationsId: string
      title: { de: string; en: string }
    }): string
    (d: any): string
    ({ id }: { id: string }): string
    ({ id }: { id: string }): string
    (arg0: any): any
  },
  mapper: {
    (d: any): {
      id: string
      teachingEvent__taxonomyId: any
      university__organizationsId: any
      studyLevels__taxonomyId: string[]
      weeklySemesterHours: any
      semesters: string[]
      title: any
      objectives: any
      contents: any
      languages: string[]
      partOfProgrammesOfStudy: string[]
      links: any
      review: any
    }
    (d: any): {
      id: any
      parent__id: any
      slug: any
      term: any
      definition: any
      abbreviations: { en: string[]; de: string[] }
      synonyms: { en: string[]; de: string[] }
      iris: string[]
      review: any
      taxonomyURI: any
    }
    (d: any): {
      slug: any
      id: any
      parent__id: any
      topLevel__id: any
      partOfCommunityDegree: any
      instanceOfs__taxonomyId: string[]
      befideOrganizationCategories: string[]
      label: any
      description: any
      head: any
      headLiteral: any
      location: any
      links: any
      uniquePeopleCount: any
      uniquePeopleCountSum: any
      uniquePeopleCountRecursiveSum: any
      review: any
    }
    (d: any): {
      id: any
      slug: any
      instanceOf__taxonomyId: any
      partOf__id: any
      host__organizationsId: any
      successorOf__id: any
      parent__id: any
      isUserFacility: any
      isBMBF_FIS: any
      label: any
      tagLine: any
      definition: any
      primaryApplications__taxonomyId: string[]
      secondaryApplications__taxonomyId: string[]
      lifeCycle: any
      parameters: any
      links: any
      references: string[]
      review: any
    }
    (arg0: any): any
  },
  postprocess?:
    | { (data: any): void; (arg0: void | unknown[]): void }
    | undefined
) {
  const outputFolder = path.join(
    __dirname,
    "../src/content/domain/",
    collectionKey
  )
  fs.rmSync(outputFolder, { recursive: true, force: true })
  fs.mkdir(outputFolder, (err) => {
    if (err) {
      return console.error(err)
    }
    console.log("Directory created successfully!")
  })
  const csvFolder = path.join(
    __dirname,
    "../src/data/",
  )

  fs.mkdir(csvFolder, (err) => {
    if (err) {
      return console.error(err)
    }
    console.log("Directory created successfully!")
  })

  const data = await fetch(
    "https://befide.getgrist.com/api/docs/vGtqDxisUdjkKYGmpzAkDj/download/csv?tableId=" +
      tableId,
    {
      headers: {
        accept: "text/csv",
        Authorization: "Bearer 839145cf5a7092364d1df58b0908952403ad9657",
      },
    }
  )
    .then((response) => response.text())
    .then((data) => csv2json(data, { nested: true }))
    .catch((error) => console.error("Error:", error))

  if (postprocess) postprocess(data)




  const csvResult: any[] = []


  data.forEach((d: any) => {
    const id = idMapper(d)
    const filePath = path.join(outputFolder, id + ".mdx")

    const frontmatter = { ...mapper(d) }



    const markdown = "---\n" + YAML.stringify(frontmatter) + "---\n"

    console.log("writing file: " + filePath)
    fs.writeFileSync(filePath, markdown)



    csvResult.push(frontmatter)
  })

  function formatValue(value: unknown): string {
    return  (Array.isArray(value)) ?  createFormatValue(",")(value.join(",")) : createFormatValue(",")(value)
  }

  if (Array.isArray(data)) {
    const csvFilePath = path.join(csvFolder, collectionKey + ".csv")
    fs.writeFileSync(csvFilePath, json2csv(csvResult, {formatValue}))

  }
}

const courseIdGenerator = ({
  university__organizationsId,
  title,
}: {
  university__organizationsId: string
  title: { de: string; en: string }
}) => slug(university__organizationsId + "/" + title.de)

const doCourses = async () =>
  await doTable("courses", "Courses", courseIdGenerator, (d: any) => ({
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
  }))

const doTaxonomy = async () =>
  await doTable(
    "taxonomy-items",
    "Taxonomy_items",
    (d: { id: string }) => slug(d.id),
    (d: {
      id: any
      taxonomyURI: any
      parent__id: any
      term: any
      definition: any
      abbreviations: { en: string | undefined; de: string | undefined }
      synonyms: { en: string | undefined; de: string | undefined }
      iris: string | undefined
      review: any
    }) => ({
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
    })
  )

const doOrganizations = async () =>
  await doTable(
    "organizations",
    "Organizations",
    ({ id }: { id: string }) => slug(id),
    (d: {
      id: any
      parent__id: any
      topLevel__id: any
      partOfCommunityDegree: any
      instanceOfs__taxonomyId: string | undefined
      befideOrganizationCategories: string | undefined
      label: any
      description: any
      head: any
      headLiteral: any
      location: any
      links: any
      uniquePeopleCount: any
      uniquePeopleCountSum: any
      uniquePeopleCountRecursiveSum: any
      review: any
    }) => ({
      id: d.id,
      parent__id: d.parent__id,
      topLevel__id: d.topLevel__id,
      partOfCommunityDegree: d.partOfCommunityDegree,
      instanceOfs__taxonomyId: stringToArray(d.instanceOfs__taxonomyId),
      befideOrganizationCategories: stringToArray(
        d.befideOrganizationCategories
      ),
      label: d.label,
      description: d.description,
      head: d.head,
      headLiteral: d.headLiteral,
      location: d.location,
      links: d.links,
      uniquePeopleCount: d.uniquePeopleCount,
      uniquePeopleCountSum: d.uniquePeopleCountSum,
      uniquePeopleCountRecursiveSum: d.uniquePeopleCountRecursiveSum,
      review: d.review,
    }),
    (data: any[]) => {
      const communityOrganizations = data.filter(
        (d: {
          partOfCommunityDegree: any
          befideOrganizationCategories: string | string[]
        }) =>
          d.partOfCommunityDegree &&
          d.befideOrganizationCategories.indexOf("committee") !== 0
      )
      const roots = getRoots(communityOrganizations)
      const rolledUpNode = rollupUniquePeopleCountSum(roots[0])
      console.log(rolledUpNode)
    }
  )

const doFacilities = async () =>
  await doTable(
    "facilities",
    "Facilities",
    ({ id }: { id: string }) => slug(id),
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
      parent__id: d.partOf__id || d.successorOf__id || null,
      isUserFacility: d.isUserFacility,
      isBMBF_FIS: d.isBMBF_FIS,
      label: d.label,
      tagLine: d.tagLine,
      definition: d.definition,
      primaryApplications__taxonomyId: stringToArray(
        d.primaryApplications__taxonomyId
      ),
      secondaryApplications__taxonomyId: stringToArray(
        d.secondaryApplications__taxonomyId
      ),
      lifeCycle: d.lifeCycle,
      parameters: {
        ...d.parameters,
        primaryBeamParticles: stringToArray(d.parameters?.primaryBeamParticles),
        secondaryBeamParticles: stringToArray(
          d.parameters?.secondaryBeamParticles
        ),
      },
      links: d.links,
      references: stringToArray(d.references),
      review: d.review,
    })
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
      ...Object.fromEntries(
        peopleCountDiscriminators.map((d) => [
          d,
          getValue(node.data.uniquePeopleCountSum, d),
        ])
      ),
    }
  } else {
    node.children.forEach((child: any) => rollupUniquePeopleCountSum(child))
    node.data.uniquePeopleCountRecursiveSum = {
      total: node.children.reduce(
        (sum: any, child: { data: { uniquePeopleCountRecursiveSum: any } }) =>
          sum + getValue(child.data.uniquePeopleCountRecursiveSum, "total"),
        getValue(node.data.uniquePeopleCountSum, "total")
      ),
      ...Object.fromEntries(
        peopleCountDiscriminators.map((d) => [
          d,
          node.children.reduce(
            (
              sum: any,
              child: { data: { uniquePeopleCountRecursiveSum: any } }
            ) => sum + getValue(child.data.uniquePeopleCountRecursiveSum, d),
            getValue(node.data.uniquePeopleCountSum, d)
          ),
        ])
      ),
    }
  }

  return node
}

await doOrganizations()
await doTaxonomy()
await doFacilities()
await doCourses()
