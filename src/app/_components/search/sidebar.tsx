'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { type Tag } from '@/server/db/schema'
import _ from 'lodash'

const TAG_TYPES: { name: Tag['type']; plural: string }[] = [
  { name: 'category', plural: 'Categories' },
  { name: 'tag', plural: 'Tags' },
]

export const SearchSidebar = ({ tags }: { tags: Tag[] }) => {
  const tagsByType = useMemo(() => _.groupBy(tags, 'type'), [tags])
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedTags, setSelectedTags] = useState(
    new Set(searchParams.get('tag') ?? []),
  )

  const onChangeAllTags = (type: Tag['type']) => {
    if (selectedTags.size !== tags.length) {
      setSelectedTags(new Set(tagsByType[type]?.map((t) => t.id.toString())))
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
  }, [selectedTags, router, searchParams])

  return (
    <div className="ml-8 flex gap-6 md:min-w-[250px] md:flex-col">
      {TAG_TYPES.map(({ name, plural }) => (
        <div key={name} className="flex w-full flex-col gap-2">
          <div className="font-bold">{plural}</div>
          <div className="flex w-full flex-wrap gap-2 md:flex-col">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all"
                checked={selectedTags.size === tags.length}
                onClick={() => onChangeAllTags(name)}
              />
              <label htmlFor="terms" className="text-sm leading-none">
                All {plural}
              </label>
            </div>
            {tags
              .filter((t) => t.type === name)
              .map(({ id, name }) => (
                <div className="flex items-center space-x-2" key={id}>
                  <Checkbox
                    id={name}
                    checked={selectedTags.has(id.toString())}
                    onCheckedChange={(isChecked) =>
                      onChangeTag(!!isChecked, id)
                    }
                  />
                  <label htmlFor={name} className="text-sm leading-none">
                    {name}
                  </label>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
