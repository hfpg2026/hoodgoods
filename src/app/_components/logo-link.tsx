'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export const HeaderLogoLink = () => {
  const router = useRouter()
  return (
    <Image
      src="/assets/logo-header.svg"
      width={150}
      height={50}
      alt="Hood Goods"
      priority
      onClick={() => router.push('/')}
      className="cursor-pointer"
    />
  )
}
