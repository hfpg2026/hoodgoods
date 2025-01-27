'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    <div className="relative w-full">
      <form className="flex flex-row" onSubmit={() => onSearch(searchTerm)}>
        <input
          className="focus:shadow-outline h-10 w-full rounded-lg border border-primary pl-3 pr-8 text-base"
          type="text"
          placeholder="Find your 'hood good"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          className="focus:shadow-outline ml-2 h-10 w-1/3 rounded-lg border border-primary pl-3 pr-8 text-base"
          type="text"
          placeholder="Postcode"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
        <button
          className="flex items-center rounded-r-lg px-3 font-bold"
          formAction={() => onSearch(searchTerm)}
        >
          🔍
        </button>
      </form>
    </div>
  )
}
