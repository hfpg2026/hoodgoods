import { api } from '@/trpc/server'

import { BusinessCard } from '../_components/business-card'
import { Navbar } from '../_components/navbar'

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const { search: searchTerm, postalCode, tag } = await searchParams

  const tags = await api.tag.findAll()
  const businesses = await api.business.find({
    orderKey: 'createdAt',
    order: 'desc',
    limit: 10,
    searchTerm,
    postalCode,
    tag,
  })

  return (
    <main className="flex min-h-screen w-full flex-col gap-2 pb-6 pt-2">
      <Navbar initialSearch={searchTerm} initialPostalCode={postalCode} />

      {/* businessess */}
      <div className="flex w-full place-content-center pt-4">
        {businesses.length === 0 && (
          <div className="flex flex-col gap-4 text-center">
            <div>
              Uh-oh, nothing was found, try searching for something else!
            </div>
          </div>
        )}
        <div className="grid w-9/12 grid-cols-3 gap-4">
          {businesses.map(({ business: b }) => (
            <BusinessCard key={b.id} biz={b} />
          ))}
        </div>
      </div>
    </main>
  )
}
