'use client'

import { useState } from 'react'

export const Searchbar = ({
  onSearch = (s) => console.log(s),
}: {
  onSearch?: (s: string) => void
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <div className="relative w-full">
      <form onSubmit={() => onSearch(searchTerm)}>
        <input
          className="focus:shadow-outline border-dark-brown h-10 w-full rounded-lg border pl-3 pr-8 text-base"
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
