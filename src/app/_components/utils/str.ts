export const toTitleCase = (str: string) =>
  str.toLowerCase().replace(/\b(\w)/g, (k) => k.toUpperCase())
