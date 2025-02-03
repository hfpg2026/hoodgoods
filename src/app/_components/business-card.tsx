'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { type Business } from '@/server/api/routers/business'
import { api } from '@/trpc/react'

import { toTitleCase } from './utils/str'

export const BusinessCard = ({ biz }: { biz: Partial<Business> }) => {
  const {
    id,
    businessImages,
    name,
    description,
    nearestMrt,
    nearestMrtDistance,
  } = biz
  const router = useRouter()
  const { data: imageSrc } = api.upload.get.useQuery(
    {
      id: businessImages?.[0]?.uploadId ?? 0, // should not run
      businessId: id ?? 0,
    },
    { enabled: !!businessImages?.[0]?.uploadId && !!id },
  )

  return (
    <div
      className="align-center flex cursor-pointer flex-col gap-4 rounded-lg bg-accent shadow-md"
      onClick={() => router.push(`/biz/${id}`)}
    >
      {imageSrc?.url ? (
        <picture>
          <img
            src={imageSrc.url}
            alt={name}
            width={400}
            height={100}
            className="object-cover"
          />
        </picture>
      ) : (
        <div className="self-center pt-3">
          <Image
            src="/assets/paperbag.svg"
            height={56}
            width={56}
            alt={name ?? ''}
          />
        </div>
      )}

      <div className="flex flex-col place-content-center justify-between gap-2 p-3">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold text-primary">{name}</div>
          <div>{description}</div>
        </div>
        {nearestMrt && nearestMrtDistance && (
          <div className="pt-1 text-sm italic">
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
