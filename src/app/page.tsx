import Image from 'next/image'
import { api, HydrateClient } from '@/trpc/server'

import { BusinessCardGrid } from './_components/business-card'
import { Footer } from './_components/footer'
import { NavMenu } from './_components/nav-menu'
import { Searchbar } from './_components/searchbar'
import { Tag } from './_components/tag'

export default async function Home() {
  const tags = await api.tag.findAll({ type: 'category' })
  const { businesses } = await api.business.find({
    orderKey: 'createdAt',
    order: 'desc',
    limit: 6,
  })

  return (
    <HydrateClient>
      <main className="flex h-full min-h-screen w-full flex-col gap-2 bg-background px-2 pb-6 pt-3">
        <div className="flex w-full items-center justify-end px-6">
          <NavMenu />
        </div>
        <div className="flex w-full place-content-center">
          <Image
            src="/assets/logo-rainbow.svg"
            width={720}
            height={200}
            alt="Hood Goods"
            priority
          />
        </div>
        {/* searchbar */}
        <div className="flex w-full place-content-center">
          <div className="m-2 w-full md:w-9/12">
            <Searchbar />
          </div>
        </div>
        {/* tags */}
        <div className="flex w-full place-content-center">
          <div className="flex w-full flex-wrap place-content-center gap-2 md:w-9/12">
            {tags.map((t) => (
              <Tag key={t.id} tag={t} />
            ))}
          </div>
        </div>
        {/* new businessess */}
        <div className="flex w-full place-content-center pt-4">
          <div className="flex w-full flex-col gap-4 md:w-9/12">
            <div className="text-lg font-bold">💖 New Kids on the Block</div>
            <BusinessCardGrid businesses={businesses} />
          </div>
        </div>
      </main>
      <Footer />
    </HydrateClient>
  )
}
