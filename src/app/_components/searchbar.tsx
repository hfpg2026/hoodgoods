'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const Searchbar = ({
  onSearch: userSearchFn,
  initialValue,
}: {
  onSearch?: (s: string) => void
  initialValue?: string
}) => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(initialValue ?? '')
  const onSearch = userSearchFn
    ? userSearchFn
    : (searchTerm: string) => router.push(`/search/?search=${searchTerm}`)

  return (
    <div className="relative w-full">
      <form onSubmit={() => onSearch(searchTerm)}>
        <input
          className="focus:shadow-outline h-10 w-full rounded-lg border border-dark-brown pl-3 pr-8 text-base"
          type="text"
          placeholder="Find your 'hood good"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-4 font-bold"
          formAction={() => onSearch(searchTerm)}
        >
          🔍
        </button>
      </form>
    </div>
  )
}
