import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Navbar } from '@/app/_components/navbar'
import { Tag } from '@/app/_components/tag'
import { api } from '@/trpc/server'

export default async function Business({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const bizId = (await params).id
  const biz = await api.business.get({ id: bizId })

  if (!biz) notFound()

  return (
    <main className="flex min-h-screen w-full flex-col gap-2 bg-bg-main pb-6">
      <Navbar />
      <div className="flex w-full place-content-center pt-4">
        <div className="flex w-9/12 flex-col gap-6">
          {/* biz header */}
          <div className="flex w-full gap-8">
            <div>
              {/* TODO logo*/}
              <Image
                src="/assets/paperbag.svg"
                height={96}
                width={96}
                alt="paperbag"
              />
            </div>
            <div className="flex flex-col gap-2 self-center">
              <div className="text-4xl font-bold text-dark-brown">
                {biz.name}
              </div>
              <div className="italic">{biz.description}</div>
            </div>
          </div>
          <div className="flex w-full gap-4">
            {biz.tagsToBusinesses.map(({ tag }) => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>

          {/* product highlights */}
          <div className="flex flex-col gap-2">
            <div className="text-lg font-bold text-dark-brown">
              🌈 Product Highlights
            </div>
            <div>
              {/* story */}
              Some product highlights
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
