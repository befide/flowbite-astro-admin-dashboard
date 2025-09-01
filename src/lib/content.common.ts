import {z} from "astro:content"
import path from "path"
import fs from "fs"
export * from "./common.d"

const __dirname = import.meta.dirname
export const DATA_PATH = path.join(__dirname, "..", "data", "grist")

export const Locales = z.string()


export const DomainObjectZodSchema = z.object({
  id: z.string().describe("Unique identifier for this entry."),
});
// export type DomainObjectSchema = z.infer<typeof DomainObjectZodSchema>;

export const NestableDomainObjectZodSchema = z.object({
  id: z.string().describe("Unique identifier for this entry."),
  parent__id: z
    .string()
    .nullable()
    .describe("Identifier of the parent entry, if any."),
});

export const LocalizedString = z.object({de: z.string(), en: z.string()})
export const NullableLocalizedString = z.object({
  de: z.string().nullable(),
  en: z.string().nullable(),
})

export const readInputFile = (filename: string) =>
  fs.readFileSync(path.join(DATA_PATH, filename))

export const ReviewSchema = z.object({
  status__id: z.string().optional().nullable(),
  reviewer__contactId: z.string().optional().nullable(),
  log: z.string().optional().nullable(),
})

export const ZodStringArrayFromString = z.preprocess((input) => {
  return input ? (input + "").split(/\s?,\s?/).filter((d) => !!d) : []
}, z.array(z.string()))
