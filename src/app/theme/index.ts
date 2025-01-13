export * from './govt-banner'
export * from './utils'

/**
 * Function to return undefined if the value is falsy, otherwise true
 */
export const dataAttr = (value: unknown) => (value ? true : undefined)
