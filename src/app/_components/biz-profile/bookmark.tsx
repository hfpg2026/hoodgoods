import { useState } from 'react'
import Image from 'next/image'
import { api } from '@/trpc/react'

export const Bookmark = ({ bizId }: { bizId: number }) => {
  const [{ total, isUserBookmark }] = api.bookmark.getForBiz.useSuspenseQuery({
    businessId: bizId,
  })

  const [count, setCount] = useState(total)
  const { mutate: saveBookmark } = api.bookmark.create.useMutation({
    onSuccess: ({ isInsert: insert }) => insert && setCount(count + 1),
  })
  const { mutate: deleteBookmark } = api.bookmark.delete.useMutation({
    onSuccess: ({ isDelete }) => isDelete && setCount(count - 1),
  })
  return (
    <div
      className="flex flex-col text-center"
      onClick={() =>
        isUserBookmark
          ? deleteBookmark({ id: bizId })
          : saveBookmark({ id: bizId })
      }
    >
      {isUserBookmark ? (
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
