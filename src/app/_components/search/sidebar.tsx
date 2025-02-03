'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { type Tag } from '@/server/db/schema'

export const SearchSidebar = ({ tags }: { tags: Tag[] }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedTags, setSelectedTags] = useState(
    new Set(searchParams.get('tag') ?? []),
  )

  const onChangeAllTags = () => {
    if (selectedTags.size !== tags.length) {
      setSelectedTags(new Set(tags.map((t) => t.id.toString())))
    } else {
      setSelectedTags(new Set())
    }
  }
  const onChangeTag = (isChecked: boolean, id: number) => {
    if (isChecked) {
      setSelectedTags((tags) => {
        tags.add(id.toString())
        return new Set(tags)
      })
    } else {
      setSelectedTags((tags) => {
        tags.delete(id.toString())
        return new Set(tags)
      })
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tag')
    selectedTags.forEach((id) => params.append('tag', id ?? ''))
    router.push(`/search/?${params.toString()}`)
  }, [selectedTags])

  return (
    <div className="flex w-full gap-4 px-8 md:max-w-[300px] md:flex-col">
      <div className="flex w-full flex-col gap-2">
        <div className="font-bold">Categories</div>
        <div className="flex w-full flex-wrap gap-2 md:flex-col">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all"
              checked={selectedTags.size === tags.length}
              onClick={onChangeAllTags}
            />
            <label htmlFor="terms" className="text-sm leading-none">
              All Categories
            </label>
          </div>
          {tags.map(({ id, name }) => (
            <div className="flex items-center space-x-2" key={id}>
              <Checkbox
                id={name}
                checked={selectedTags.has(id.toString())}
                onCheckedChange={(isChecked) => onChangeTag(!!isChecked, id)}
              />
              <label htmlFor={name} className="text-sm leading-none">
                {name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
