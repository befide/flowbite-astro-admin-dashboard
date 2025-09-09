import type { SectionSchema } from "./sections.config"

export class Section {
  data: SectionSchema

  constructor(data: SectionSchema) {
    this.data = data
  }

  getSectionNumbers() {
    return this.data.sectionNumber?.split(".") || []
  }

  getDepth() {
    return this.getSectionNumbers().length
  }
}
