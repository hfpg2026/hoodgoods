'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { NavMenu } from './nav-menu'
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
    <div className="flex w-full flex-wrap items-center justify-between px-4 pt-2">
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
      <div className="m-auto flex hidden w-9/12 md:block">
        {showSearch && <Searchbar initialValue={initialSearch} />}
      </div>
      <div>
        <NavMenu />
      </div>
      <div className="m-auto block flex w-full pt-2 md:hidden">
        {showSearch && <Searchbar initialValue={initialSearch} />}
      </div>
    </div>
  )
}
