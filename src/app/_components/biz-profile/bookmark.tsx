'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { api } from '@/trpc/react'
import { useSession } from 'next-auth/react'

export const Bookmark = ({ bizId }: { bizId: number }) => {
  const session = useSession()
  const router = useRouter()

  const [{ count: originalCount, isUserBookmark }] =
    api.bookmark.getForBiz.useSuspenseQuery({
      businessId: bizId,
    })
  const [isBookmarked, setIsBookmarked] = useState(isUserBookmark)

  const [count, setCount] = useState(originalCount)
  const { mutateAsync: saveBookmark, isPending } =
    api.bookmark.create.useMutation({
      onSuccess: ({ count: newCount }) => {
        setIsBookmarked(true)
        setCount(newCount)
      },
    })
  const { mutate: deleteBookmark } = api.bookmark.delete.useMutation({
    onSuccess: ({ count: newCount }) => {
      setIsBookmarked(false)
      setCount(newCount)
    },
  })
  return (
    <div
      className="flex w-[30px] cursor-pointer flex-col gap-1 text-center"
      onClick={() =>
        isPending
          ? true // do nothing
          : !session.data?.user.id
            ? router.push('/login')
            : isBookmarked
              ? deleteBookmark({ id: bizId })
              : saveBookmark({ id: bizId })
      }
    >
      {isBookmarked ? (
        <Image
          src="/assets/bookmark-filled.svg"
          alt="bookmark"
          height={30}
          width={30}
        />
      ) : (
        <Image
          src="/assets/bookmark.svg"
          alt="bookmark"
          height={30}
          width={30}
        />
      )}
      <div>{count}</div>
    </div>
  )
}
