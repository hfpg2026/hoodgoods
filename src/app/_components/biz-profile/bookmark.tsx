import { useState } from 'react'
import Image from 'next/image'
import { api } from '@/trpc/react'

export const Bookmark = ({ bizId }: { bizId: number }) => {
  const [{ total, isUserBookmark }] = api.bookmark.getForBiz.useSuspenseQuery({
    businessId: bizId,
  })
  const [isBookmarked, setIsBookmarked] = useState(isUserBookmark)

  const [count, setCount] = useState(total)
  const { mutateAsync: saveBookmark, isPending } =
    api.bookmark.create.useMutation({
      onSuccess: () => {
        setIsBookmarked(true)
        setCount(count + 1)
      },
    })
  const { mutate: deleteBookmark } = api.bookmark.delete.useMutation({
    onSuccess: () => {
      setIsBookmarked(false)
      setCount(count - 1)
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
