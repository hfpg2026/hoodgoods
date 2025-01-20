import { notFound } from 'next/navigation'
import { BizProfilePage } from '@/app/_components/biz-profile/biz-profile-page'
import { api } from '@/trpc/server'

export default async function BizProfile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const bizId = (await params).id
  const biz = await api.business.get({ id: bizId })
  if (!biz) notFound()

  const tagList = await api.tag.findAll()

  return <BizProfilePage biz={biz} tagList={tagList} />
}
