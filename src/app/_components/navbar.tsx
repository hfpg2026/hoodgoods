'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { AuthButton } from './auth-button'
import { Searchbar } from './searchbar'

export const Navbar = ({
  initialSearch,
  showSearch = true,
}: {
  initialSearch?: string
  showSearch?: boolean
}) => {
  const router = useRouter()

  return (
    <div className="flex w-full items-center justify-between px-3 pt-2">
      <div>
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
      <div className="m-auto flex w-9/12">
        {showSearch && <Searchbar initialValue={initialSearch} />}
      </div>
      <div>
        <AuthButton />
      </div>
    </div>
  )
}
