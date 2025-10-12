import { computed, task } from "nanostores";
import { $locale } from "@nanostores/locale";
import crossfilter from "crossfilter2";

export const $courses = computed($locale, (locale) =>
  task(async () => {
    return await fetch("/" + locale + "/api/courses.json").then((response) => {
      return response.json();
    });
  }),
);

export const $coursesIndex = computed($courses, (courses) =>
  task(async () => {
    return crossfilter(courses || []);
  }),
);
