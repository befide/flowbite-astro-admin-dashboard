import { atom, onMount, task } from "nanostores"

export const $locale = atom<"en" | "de">("en")

onMount($locale, () => {
  task(async () => {
    $locale.set(document.location.href.indexOf("/de/") > -1 ? "de" : "en")
  })
})
