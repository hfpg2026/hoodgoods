import Image from 'next/image'
import { api, HydrateClient } from '@/trpc/server'

import { BusinessCard } from './_components/business-card'
import { NavMenu } from './_components/nav-menu'
import { Searchbar } from './_components/searchbar'
import { Tag } from './_components/tag'

// TODO fetch from db
export default async function Home() {
  const tags = await api.tag.findAll()
  const businesses = await api.business.find({
    orderKey: 'createdAt',
    order: 'desc',
    limit: 5,
  })

  return (
    <HydrateClient>
      <main className="flex min-h-screen w-full flex-col gap-2 bg-background pb-6 pt-2">
        <div className="flex w-full items-center justify-end px-6">
          <NavMenu />
        </div>
        <div className="flex w-full place-content-center">
          <Image
            src="/assets/logo-lg.svg"
            width={200}
            height={200}
            alt="Hood Goods"
            priority
          />
        </div>
        {/* searchbar */}
        <div className="flex w-full place-content-center">
          <div className="flex w-9/12 gap-6">
            <Searchbar />
          </div>
        </div>
        {/* tags */}
        <div className="flex w-full place-content-center">
          <div className="flex w-9/12 flex-wrap place-content-center gap-2">
            {tags.map((t) => (
              <Tag key={t.id} tag={t} />
            ))}
          </div>
        </div>
        {/* new businessess */}
        <div className="flex w-full place-content-center pt-4">
          <div className="flex w-9/12 flex-col gap-4">
            <div className="text-lg font-bold text-primary">
              💖 New Kids on the Block
            </div>
            {businesses.map(({ business: b }) => (
              <BusinessCard key={b.id} biz={b} />
            ))}
          </div>
        </div>
      </main>
    </HydrateClient>
  )
}
