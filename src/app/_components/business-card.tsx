'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { type Business } from '@/server/api/routers/business'
import { api } from '@/trpc/react'

import { toTitleCase } from './utils/str'

const BusinessCard = ({ biz }: { biz: Partial<Business> }) => {
  const {
    id,
    businessImages,
    name,
    description,
    nearestMrt,
    nearestMrtDistance,
  } = biz
  const router = useRouter()
  const uploadId = businessImages?.[0]?.uploadId
  const { data: imageSrc } = api.upload.get.useQuery(
    {
      id: uploadId ?? 0, // should not run
      businessId: id ?? 0,
    },
    { enabled: !!uploadId && !!id },
  )

  return (
    <div
      className="align-center flex w-full cursor-pointer flex-col gap-2 rounded-lg bg-accent shadow-md"
      onClick={() => router.push(`/biz/${id}`)}
    >
      {imageSrc?.url ? (
        <picture>
          <img
            src={imageSrc.url}
            alt={name}
            className="h-[250px] w-full rounded-t-lg object-cover"
          />
        </picture>
      ) : !!uploadId ? (
        <Skeleton className="h-[250px] w-full" />
      ) : (
        <div className="self-center pt-3">
          <Image
            src="/assets/paperbag.svg"
            height={200}
            width={190}
            alt={name ?? ''}
          />
        </div>
      )}

      <div className="flex flex-col place-content-center justify-between gap-3 p-3">
        <div className="flex flex-col gap-1">
          <div className="text-lg font-bold text-primary">{name}</div>
          <div className="italic">{description}</div>
        </div>
        {nearestMrt && nearestMrtDistance && (
          <div className="pt-1 text-sm">
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

const BusinessCardGridLoader = () => {
  return (
    <div className="grid h-fit grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="flex flex-col space-y-3 shadow-md">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  )
}

export const BusinessCardGrid = ({
  businesses,
}: {
  businesses: Business[]
}) => {
  return (
    <Suspense fallback={<BusinessCardGridLoader />}>
      <div className="grid h-fit w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {businesses.map((b) => (
          <BusinessCard key={b.id} biz={b} />
        ))}
      </div>
    </Suspense>
  )
}
