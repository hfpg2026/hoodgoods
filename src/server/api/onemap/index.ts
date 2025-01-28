import { ALL_MRTS } from './all-mrts'

const URL =
  'https://www.onemap.gov.sg/api/common/elastic/search?returnGeom=Y&getAddrDetails=N&searchVal='
export const postalCodeToSvy21 = async (postalCode: string) => {
  const response = await fetch(`${URL}${postalCode}`, {
    method: 'GET',
    headers: process.env.ONEMAP_API_KEY
      ? {
          Authorization: process.env.ONEMAP_API_KEY,
        }
      : undefined,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await response.json()
  const { results } = data as {
    results: { X: string; Y: string }[]
  }
  const { X: x, Y: y } = results.at(0) ?? { X: '0', Y: '0' }
  return { x, y }
}

const getDist = (
  target: { svy21X: string; svy21Y: string },
  input: { x: string; y: string },
) => {
  return Math.pow(
    Math.pow(Number(target.svy21X) - Number(input.x), 2) +
      Math.pow(Number(target.svy21Y) - Number(input.y), 2),
    0.5,
  )
}

export const postalCodeSortFn =
  (input: { x: string; y: string }) =>
  (
    a: { svy21X: string | null; svy21Y: string | null },
    b: { svy21X: string | null; svy21Y: string | null },
  ) => {
    if (a.svy21X && a.svy21Y && b.svy21X && b.svy21Y) {
      const distA = getDist({ svy21X: a.svy21X, svy21Y: a.svy21Y }, input)
      const distB = getDist({ svy21X: b.svy21X, svy21Y: b.svy21Y }, input)

      return distA - distB
    }
    return a.svy21X ? -1 : b.svy21X ? 1 : 0
  }

export const getNearestMrt = (target: { x: string; y: string }) => {
  const nearestMrt = [...ALL_MRTS].sort(postalCodeSortFn(target))[0]!
  return { nearestMrt: nearestMrt.station, dist: getDist(nearestMrt, target) }
}
