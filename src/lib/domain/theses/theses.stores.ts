import crossfilter from "crossfilter2";
import { computed, task } from "nanostores";
import { $locale } from "@lib/nanostores/locale";

export const $theses = computed($locale, (locale) =>
  task(async () => {
    return await fetch("/" + locale + "/api/theses.json").then((response) => {
      return response.json();
    });
  }),
);

export const $thesesIndex = computed($theses, (theses) =>
  task(async () => {
    return crossfilter(theses || []);
  }),
);
