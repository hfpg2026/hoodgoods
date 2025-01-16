'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Searchbar } from './searchbar'

export const Navbar = ({ initialSearch }: { initialSearch?: string }) => {
  const router = useRouter()

  return (
    <div className="relative flex w-full place-content-center">
      <div className="absolute left-3 top-4">
        <Image
          src="/assets/logo-header.svg"
          width={150}
          height={50}
          alt="Hood Goods"
          priority
          onClick={() => router.push('/')}
          className="cursor-pointer"
        />
      </div>
      <div className="m-auto flex w-9/12 pt-2">
        <Searchbar initialValue={initialSearch} />
      </div>
    </div>
  )
}
