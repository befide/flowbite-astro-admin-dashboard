export * from "./courses";
export * from "./facilities";
export * from "./organizations";
export * from "./theses";
export * from "./references";
export * from "./taxonomy";

const translations: Record<string, Record<string, string>> = {
  ":male": {
    en: "male",
    de: "männlich",
  },
  ":female": {
    en: "female",
    de: "weiblich",
  },
  en: {
    en: "English",
    de: "Englisch",
  },
  de: {
    en: "German",
    de: "Deutsch",
  },
  summer: {
    en: "2. Summer semester",
    de: "2. Sommer-Semester",
  },
  winter: {
    en: "1. Winter semester",
    de: "1. Winter-Semester",
  },
  "Brandenburgisch Technische Universität Cottbus-Senftenberg": {
    en: "BTU Cottbus-Senftenberg",
    de: "BTU Cottbus-Senftenberg",
  },
};

export const getValueTranslation = (key: string, locale: string) => {
  return translations[key] ? translations[key][locale] : key;
};
