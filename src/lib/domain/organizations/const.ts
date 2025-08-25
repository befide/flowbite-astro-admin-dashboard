export const genders = ["female", "male", "nonbinary"]
export const careerLevels = [
  "professor",
  "seniorResearcher",
  "postDoc",
  "phdStudent",
  "masterStudent",
  "bachelorStudent",
]
export const disciplinaryProfessions = ["physicist", "engineer", "other"]
export const peopleCountDiscriminators = [
  ...careerLevels,
  ...disciplinaryProfessions,
  ...genders,
]
