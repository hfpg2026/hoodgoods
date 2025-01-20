'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { type Tag as TagType } from '@/server/db/schema'

export const Tag = ({ tag }: { tag: TagType }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isActive = searchParams.get('tag') === tag.id.toString()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )

  return (
    <Button
      variant={isActive ? undefined : 'outline'}
      onClick={() =>
        router.push(`/search/?${createQueryString('tag', tag.id.toString())}`)
      }
    >
      {tag.name}
    </Button>
  )
}
