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
