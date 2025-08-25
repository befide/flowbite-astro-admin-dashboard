import { atom } from "nanostores"

export const theme = atom("light")

export function toggleTheme() {
  theme.set(theme.get() === "light" ? "dark" : "light")
}
