import { api } from '@/trpc/server'

import { BusinessCard } from '../_components/business-card'
import { Navbar } from '../_components/navbar'
import { Tag } from '../_components/tag'

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const { search: searchTerm, tag } = await searchParams

  const tags = await api.tag.findAll()
  const businesses = await api.business.find({
    orderKey: 'createdAt',
    order: 'desc',
    limit: 10,
    searchTerm,
    tag,
  })

  return (
    <main className="flex min-h-screen w-full flex-col gap-2 pb-6 pt-2">
      <Navbar initialSearch={searchTerm} />
      {/* tags */}
      <div className="flex w-full place-content-center gap-2">
        {tags.map((t) => (
          <Tag key={t.id} tag={t} />
        ))}
        {/* TODO filter */}
      </div>

      {/* businessess */}
      <div className="flex w-full place-content-center pt-4">
        <div className="flex w-9/12 flex-col gap-4">
          {businesses.map(({ business: b }) => (
            <BusinessCard
              key={b.id}
              id={b.id}
              name={b.name}
              description={b.description ?? ''}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
