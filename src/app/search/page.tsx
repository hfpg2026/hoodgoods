'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { api } from '@/trpc/react'

import { BusinessCard } from '../_components/business-card'
import { Navbar } from '../_components/navbar'
import { BusinessPagination } from '../_components/pagination'
import { SearchSidebar } from '../_components/search/sidebar'

export default function Search({}: {
  searchParams: Promise<{
    search?: string
    postalCode?: string
    tag?: string | string[]
  }>
}) {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('search') ?? undefined
  const postalCode = searchParams.get('postalCode') ?? undefined
  const tags = searchParams.getAll('tag')

  const limit = 12
  const [page, setPage] = useState(1)
  const [{ businesses, totalCount }] = api.business.find.useSuspenseQuery({
    orderKey: 'createdAt',
    order: 'desc',
    limit, // 4 rows of 3
    page,
    searchTerm,
    postalCode,
    tags,
  })
  const [allTags] = api.tag.findAll.useSuspenseQuery()

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
            {businesses.map((b) => (
              <BusinessCard key={b.id} biz={b} />
            ))}
          </div>
        )}
      </div>

      <BusinessPagination
        totalPages={Math.ceil(totalCount / limit)}
        currentPage={page}
        onClickPrev={() => setPage((page) => page - 1)}
        onClickNext={() => setPage((page) => page + 1)}
        onClickPage={(p: number) => setPage(p)}
      />
    </main>
  )
}
