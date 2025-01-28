'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Business } from '@/server/api/routers/business'
import { api } from '@/trpc/react'

import { toTitleCase } from './utils/str'

export const BusinessCard = ({ biz }: { biz: Partial<Business> }) => {
  const { id, logoId, name, description, nearestMrt, nearestMrtDistance } = biz
  const router = useRouter()
  const { data: imageSrc } = api.upload.get.useQuery(
    {
      id: logoId ?? 0, // should not run
      businessId: id ?? 0,
    },
    { enabled: !!logoId && !!id },
  )

  return (
    <div
      className="flex cursor-pointer gap-4 rounded-lg bg-accent shadow-md"
      onClick={() => router.push(`/biz/${id}`)}
    >
      {imageSrc?.url ? (
        <picture>
          <img src={imageSrc.url} alt={name} width={24} height={9246} />
        </picture>
      ) : (
        <div className="p-4">
          <Image
            src="/assets/paperbag.svg"
            height={56}
            width={56}
            alt={name ?? ''}
          />
        </div>
      )}

      <div className="flex flex-col place-content-center">
        <div className="font-bold text-primary">{name}</div>
        <div className="italic text-primary">{description}</div>
        {nearestMrt && nearestMrtDistance && (
          <div className="pt-2 text-sm">
            📍{' '}
            {Number(nearestMrtDistance) < 1000
              ? Number(nearestMrtDistance).toFixed(0) + 'm'
              : (Number(nearestMrtDistance) / 1000).toFixed(0) + 'km'}{' '}
            from {toTitleCase(nearestMrt)}
          </div>
        )}
      </div>
    </div>
  )
}
