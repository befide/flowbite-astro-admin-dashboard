import { computed, task } from "nanostores";
import { $locale } from "@lib/nanostores/locale";
import crossfilter from "crossfilter2";

export const $organizations = computed($locale, (locale) =>
  task(async () => {
    return await fetch("/" + locale + "/api/organizations.json").then(
      (response) => {
        return response.json();
      },
    );
  }),
);

export const $organizationsIndex = computed($organizations, (organizations) =>
  task(async () => {
    return crossfilter((await organizations) || []);
  }),
);
