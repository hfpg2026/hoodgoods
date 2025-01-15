import { api } from '@/trpc/server'

import { BusinessCard } from '../_components/business-card'
import { Searchbar } from '../_components/searchbar'
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
    <main className="flex min-h-screen w-full flex-col gap-2 bg-bg-main pb-6">
      {/* header */}
      <div className="relative flex w-full place-content-center">
        {/* TODO logo */}
        <div className="absolute left-0 top-2">Hood Goods Logo</div>
        <div className="m-auto flex w-9/12 pt-2">
          <Searchbar initialValue={searchTerm} />
        </div>
      </div>
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
              name={b.name}
              description={b.description ?? ''}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
