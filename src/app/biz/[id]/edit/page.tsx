'use client'

import { useCallback } from 'react'
import { notFound, useParams } from 'next/navigation'
import { BizProfilePage } from '@/app/_components/biz-profile/biz-profile-page'
import { type BizUpdateType } from '@/server/api/routers/business'
import { api } from '@/trpc/react'
import { useForm } from 'react-hook-form'

export default function BizProfileEdit() {
  const params = useParams()
  const bizId = params.id as string
  const [biz] = api.business.get.useSuspenseQuery({ id: bizId })
  if (!biz) notFound()

  const form = useForm<BizUpdateType>({
    defaultValues: {
      id: biz.id,
      name: biz.name,
      description: biz.description ?? undefined,
    },
  })
  const { control, getValues } = form

  const { mutate, error } = api.business.update.useMutation()
  const onSubmit = useCallback(async () => {
    void mutate({ ...getValues(), id: Number(bizId) })
  }, [])

  return <BizProfilePage biz={biz} isEdit />
}
