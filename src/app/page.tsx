import Image from 'next/image'
import { api, HydrateClient } from '@/trpc/server'

import { BusinessCard } from './_components/business-card'
// import { Navbar } from './_components/navbar'
import { Searchbar } from './_components/searchbar'
import { Button } from './_components/ui/button'

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
      <main className="flex min-h-screen w-full flex-col gap-2 bg-bg-main py-6">
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
        <div className="flex w-full place-content-center gap-2">
          {tags.map((t) => (
            <Button outline key={t.id}>
              {t.name}
            </Button>
          ))}
        </div>
        {/* new businessess */}
        <div className="flex w-full place-content-center pt-4">
          <div className="flex w-9/12 flex-col gap-4">
            <div className="font-bold text-dark-brown">
              💖 New Kids on the Block
            </div>
            {businesses.map((b) => (
              <BusinessCard
                key={b.id}
                name={b.name}
                description={b.description ?? ''}
              />
            ))}
          </div>
        </div>
      </main>
    </HydrateClient>
  )
}
