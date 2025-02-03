import { api } from '@/trpc/server'

import { BusinessCard } from '../_components/business-card'
import { Navbar } from '../_components/navbar'
import { SearchSidebar } from '../_components/search/sidebar'

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
    postalCode?: string
    tags?: string[]
  }>
}) {
  const { search: searchTerm, postalCode, tags } = await searchParams

  const allTags = await api.tag.findAll()
  const businesses = await api.business.find({
    orderKey: 'createdAt',
    order: 'desc',
    limit: 10,
    searchTerm,
    postalCode,
    tags,
  })

  return (
    <main className="flex min-h-screen w-full flex-col gap-2 pb-6 pt-2">
      <Navbar initialSearch={searchTerm} initialPostalCode={postalCode} />

      <div className="flex w-full flex-wrap gap-8 pt-4">
        {/* sidebar */}
        <SearchSidebar tags={allTags} />
        {/* businessess */}
        {businesses.length === 0 ? (
          <div className="flex flex-col gap-4 text-center">
            <div>
              Uh-oh, nothing was found, try searching for something else!
            </div>
          </div>
        ) : (
          <div className="grid w-full grid-cols-3 gap-4 px-4 md:w-9/12">
            {businesses.map(({ business: b }) => (
              <BusinessCard key={b.id} biz={b} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
