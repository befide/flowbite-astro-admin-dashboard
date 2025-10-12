import { glob } from "astro/loaders";

import { defineCollection, z } from "astro:content";

import {
  LocalizedString,
  NestableDomainObjectZodSchema,
  NullableLocalizedString,
  ReviewZodSchema,
} from "@lib/content.common";

export const FacilityZodSchema = NestableDomainObjectZodSchema.extend({
  partOf__id: z.string().nullable(),
  successorOf__id: z.string().nullable(),
  host__organizationsId: z.string().nullable(),

  label: LocalizedString,
  tagLine: NullableLocalizedString,
  definition: NullableLocalizedString,

  isBMBF_FIS: z.boolean(),
  isUserFacility: z.boolean(),

  instanceOf__taxonomyId: z.string(),

  lifeCycle: z.object({
    currentStatus__taxonomyId: z.string().nullable(),
    design: z.object({
      startYear: z.number().nullable(),
    }),
    realization: z.object({
      startYear: z.number().nullable(),
    }),
    operation: z.object({
      startYear: z.number().nullable(),
      endYear: z.number().nullable(),
    }),
  }),

  primaryApplications__taxonomyId: z.array(z.string()),
  secondaryApplications__taxonomyId: z.array(z.string()),

  parameters: z.object({
    primaryBeamParticles: z.array(z.string()),
    secondaryBeamParticles: z.array(z.string()),
    length__m: z.number().nullable(),
    E0__eV: z.number().nullable(),
    E1__eV: z.number().nullable(),
    emittance__mrad: z.number().nullable(),
    powerConsumption__W: z.number().nullable(),
    srPowerLoss__W: z.number().nullable(),
  }),
  links: z.object({
    homepage: NullableLocalizedString,
  }),
  references: z.array(z.string()),
  review: ReviewZodSchema,
});

export const defineFacilityCollection = defineCollection({
  loader: glob({
    pattern: "**/*.(md|mdx)",
    base: "./src/content/domain/facilities",
  }),
  schema: FacilityZodSchema,
});
