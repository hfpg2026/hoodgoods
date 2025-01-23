import { useState } from 'react'
import Image from 'next/image'
import { api } from '@/trpc/react'

export const Bookmark = ({ bizId }: { bizId: number }) => {
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
      className="flex flex-col text-center"
      onClick={() =>
        isPending
          ? true // do nothing
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
          className="m-auto"
        />
      ) : (
        <Image
          src="/assets/bookmark.svg"
          alt="bookmark"
          height={30}
          width={30}
          className="m-auto"
        />
      )}
      <div>{count}</div>
    </div>
  )
}
