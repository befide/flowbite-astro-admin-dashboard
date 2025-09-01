import type {ThesisSchema} from "@lib/domain";

export type DomainObjectSchema = {
  id: string;
  isSelected?: boolean;
};

export type NestableDomainObjectSchema = {
  id: string;
  isSelected?: boolean;
  parent__id: string | null;
};

export type OrganizationSchema = NestableDomainObjectSchema & {
  /** Unique identifier for this entry. */
  id: string;
  /** Identifier of the parent entry, if any. */
  parent__id: string | null;
  topLevel__id: string | null;
  instanceOfs__taxonomyId: string[];
  befideOrganizationCategories: ("fraunhofer" | "hgf" | "international" | "mpg" | "government" | "university" | "committee" | "funder" | "root" | "consortium")[];
  partOfCommunityDegree: "none" | "full" | "partial";
  label: {
    fullName: {
      de: string;
      en: string;
    };
    short: {
      de: string | null;
      en: string | null;
    };
  };
  description: {
    de: string | null;
    en: string | null;
  };
  links: {
    homepage: {
      de: string | null;
      en: string | null;
    };
    rorId: string | null;
  };
  location: ({
    country: ({
      code: (string | undefined) | null;
    } | undefined) | null;
    city: (string | undefined) | null;
    lat: (number | undefined) | null;
    lng: (number | undefined) | null;
  } | undefined) | null;
  uniquePeopleCount: {
    professor: {
      physicist: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
      engineer: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
      other: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
    };
    seniorResearcher: {
      physicist: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
      engineer: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
      other: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
    };
    postDoc: {
      physicist: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
      engineer: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
      other: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
    };
    phdStudent: {
      physicist: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
      engineer: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
      other: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
    };
    masterStudent: {
      physicist: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
      engineer: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
      other: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
    };
    bachelorStudent: {
      physicist: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
      engineer: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
      other: {
        male: (number | undefined) | null;
        female: (number | undefined) | null;
        nonbinary: (number | undefined) | null;
      };
    };
  };
  uniquePeopleCountSum: {
    total: number;
    professor: number;
    seniorResearcher: number;
    postDoc: number;
    phdStudent: number;
    masterStudent: number;
    bachelorStudent: number;
    physicist: number;
    engineer: number;
    other: number;
    female: number;
    male: number;
    nonbinary: number;
  };
  uniquePeopleCountRecursiveSum: {
    total: number;
    professor: number;
    seniorResearcher: number;
    postDoc: number;
    phdStudent: number;
    masterStudent: number;
    bachelorStudent: number;
    physicist: number;
    engineer: number;
    other: number;
    female: number;
    male: number;
    nonbinary: number;
  } | undefined;
  review: {
    status__id: (string | undefined) | null;
    reviewer__contactId: (string | undefined) | null;
    log: (string | undefined) | null;
  };
};


export type OrganizationDto = Pick<
  OrganizationSchema,
  "uniquePeopleCount" | "uniquePeopleCountRecursiveSum"
> & {
  id: string
  parent__id: string | null
  instanceOfs__term: string[]
  label__fullName: string
  label__short: string
  location__country: string
  location__city: string
  theses_count: number
  with_theses: boolean
  facilities_count: number
  with_facilities: boolean
  userFacilities_count: number
  with_userFacilities: boolean
  weeklySemesterHours_count: number
  with_teachingEvents: boolean
  people_count: number
}


export type CourseSchema = DomainObjectSchema & {
  /** Unique identifier for this entry. */
  // id: string;
  title: {
    de: string | null;
    en: string | null;
  };
  teachingEvent__taxonomyId: string;
  university__organizationsId: string;
  semesters: string[];
  studyLevels__taxonomyId: string[];
  partOfProgrammesOfStudy: string[];
  languages: string[];
  objectives: {
    de: string | null;
    en: string | null;
  };
  contents: {
    de: string | null;
    en: string | null;
  };
  weeklySemesterHours: number;
  links: {
    homepage: {
      de: string | null;
      en: string | null;
    };
  };
  review: {
    status__id: (string | undefined) | null;
    reviewer__contactId: (string | undefined) | null;
    log: (string | undefined) | null;
  };
};

export type CourseDto = Pick<CourseSchema, "id" | "weeklySemesterHours"> & {
  title: string
  teachingEvent__term: string
  university__label_short: string
  languages: string[]
  semesters: string[]
  link: string
  studyLevels__term: string[]
  partOfProgrammesOfStudy: string[]
}

export type FacilitySchema = NestableDomainObjectSchema & {
  /** Unique identifier for this entry. */
  // id: string;
  /** Identifier of the parent entry, if any. */
  // parent__id: string | null;
  partOf__id: string | null;
  successorOf__id: string | null;
  host__organizationsId: string | null;
  label: {
    de: string;
    en: string;
  };
  tagLine: {
    de: string | null;
    en: string | null;
  };
  definition: {
    de: string | null;
    en: string | null;
  };
  isBMBF_FIS: boolean;
  isUserFacility: boolean;
  instanceOf__taxonomyId: string | null;
  lifeCycle: {
    currentStatus__taxonomyId: string | null;
    design: {
      startYear: number | null;
    };
    realization: {
      startYear: number | null;
    };
    operation: {
      startYear: number | null;
      endYear: number | null;
    };
  };
  primaryApplications__taxonomyId: string[];
  secondaryApplications__taxonomyId: string[];
  parameters: {
    primaryBeamParticles: string[];
    secondaryBeamParticles: string[];
    length__m: number | null;
    E0__eV: number | null;
    E1__eV: number | null;
    emittance__mrad: number | null;
    powerConsumption__W: number | null;
    srPowerLoss__W: number | null;
  };
  links: {
    homepage: {
      de: string | null;
      en: string | null;
    };
  };
  references: string[];
  review: {
    status__id: (string | undefined) | null;
    reviewer__contactId: (string | undefined) | null;
    log: (string | undefined) | null;
  };
};

export type FacilityDto = Pick<FacilitySchema, "id"> & {
  label: string
  tagLine: string
  host__label_short: string
  parent__id: string | null
  instanceOf__term: string
  currentStatus__term: string
  operation_startYear: number | null
  operation_endYear: number | null
  isUserFacility: boolean
  isBMBF_FIS: boolean
  primaryBeamParticles: string[]
  secondaryBeamParticles: string[]
  length__m: number | null
}




type TaxonomyItemSchema = {
  /** Unique identifier for this entry. */
  id: string;
  /** Identifier of the parent entry, if any. */
  parent__id: string | null;
  taxonomyURI: string;
  term: {
    de: string;
    en: string;
  };
  definition: {
    de: string | null;
    en: string | null;
  };
  abbreviations: Record<string, string[]>;
  synonyms: Record<string, string[]>;
  iris: string[];
  review: {
    status__id: (string | undefined) | null;
    reviewer__contactId: (string | undefined) | null;
    log: (string | undefined) | null;
  };
};

export type TaxonomyItemDto = NestableDomainObjectSchema & {
  id: string
  parent__id: string | null
  term: string
  definition: string
  abbreviations: string[]
  synonyms: string[]
  taxonomyURI: string
}


type ThesisSchema = {
  id: string;
  citationKey: string;
  author: {
    familyName: string;
    givenName: string;
    gender: (string | undefined) | null;
  };
  year: number;
  title: string;
  language: "en" | "de";
  url?: string | undefined;
  thesisType: string;
  fulltextLink?: string | undefined;
  doi?: string | undefined;
  urn?: string | undefined;
  isbn?: string | undefined;
  abstract: (string | undefined) | null;
  publisher: string;
  tags: (string | undefined)[];
  degree: {
    title: string;
    level: string;
    grantedBy__organizationsId?: string | undefined;
  };
  employsMethod?: string | undefined;
  hasAffiliation__organizationsId: string[];
  isAbout: {
    facility__facilitiesId: string[];
    accelerationProcess__taxonomyId: (string | undefined)[];
  };
};

export type ThesisDto = Pick<
  ThesisSchema,
  "id" | "title" | "year" | "fulltextLink" | "author" | "language"
> & {
  university__label_short: string
  affiliations__label_short: string[]
  facilities__label_short: string[]
  degreeTitle: string
}
