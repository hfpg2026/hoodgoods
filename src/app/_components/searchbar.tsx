'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export const Searchbar = ({
  onSearch: userSearchFn,
  initialValue,
  initialPostalCode,
}: {
  onSearch?: (s: string) => void
  initialValue?: string
  initialPostalCode?: string
}) => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(initialValue ?? '')
  const [postalCode, setPostalCode] = useState(initialPostalCode ?? '')
  const onSearch = userSearchFn
    ? userSearchFn
    : (searchTerm: string) =>
        router.push(
          `/search/?search=${searchTerm}${/\d{6}/.test(postalCode) ? `&postalCode=${postalCode}` : ''}`,
        )

  return (
    <div className="w-full rounded-lg border border-primary bg-white p-3 pb-1">
      <form
        className="flex h-full flex-row justify-center"
        onSubmit={() => onSearch(searchTerm)}
      >
        <div className="flex w-full flex-col px-2">
          <div className="text-xs">Find your Hood Good</div>
          <input
            className="h-10 w-full py-0 font-medium focus:outline-none"
            placeholder="Search Goods"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Separator orientation="vertical" />

        <div className="flex w-full flex-col px-2">
          <div className="text-xs">Where</div>
          <input
            className="h-10 w-full font-medium focus:outline-none"
            type="number"
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>

        <Button
          formAction={() => onSearch(searchTerm)}
          className="mb-2 self-center rounded-lg"
        >
          Explore
        </Button>
      </form>
    </div>
  )
}
