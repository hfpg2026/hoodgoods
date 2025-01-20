'use client'

import { notFound, useParams } from 'next/navigation'
import { BizProfilePage } from '@/app/_components/biz-profile/biz-profile-page'
import { api } from '@/trpc/react'
import { useSession } from 'next-auth/react'

export default function BizProfileEdit() {
  const { data: session } = useSession()
  const params = useParams()
  const bizId = params.id
  const [biz] = api.business.get.useSuspenseQuery({
    id: bizId as string,
    ownerId: session?.user.id,
  })
  const [tagList] = api.tag.findAll.useSuspenseQuery()

  if (!biz) notFound()

  return <BizProfilePage biz={biz} tagList={tagList} isEdit />
}
