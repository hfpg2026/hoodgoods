'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export const BusinessCard = ({
  id,
  profilePic,
  name,
  description,
}: {
  id: number
  profilePic?: string
  name: string
  description: string
}) => {
  const router = useRouter()
  return (
    <div
      className="flex cursor-pointer gap-4 rounded-lg bg-light-brown shadow-md"
      onClick={() => router.push(`/biz/${id}`)}
    >
      {profilePic ? (
        <Image src={profilePic} height={24} width={24} alt={name} />
      ) : (
        <div className="p-4">
          <Image src="/assets/paperbag.svg" height={56} width={56} alt={name} />
        </div>
      )}

      <div className="flex flex-col place-content-center">
        <div className="font-bold text-dark-brown">{name}</div>
        <div className="italic text-dark-brown">{description}</div>
      </div>
    </div>
  )
}
