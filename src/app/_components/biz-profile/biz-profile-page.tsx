'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  DescriptionField,
  LinkField,
  NameField,
  StoryField,
  TagsField,
} from '@/app/_components/biz-profile/form-fields'
import { ProductCard } from '@/app/_components/biz-profile/product-card'
import { Navbar } from '@/app/_components/navbar'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { type BizUpdateType } from '@/server/api/routers/business'
import { type Business, type Tag } from '@/server/db/schema'
import { api } from '@/trpc/react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'

export const BizProfilePage = ({
  biz,
  tagList,
  isEdit,
}: {
  biz: Business
  tagList: Tag[]
  isEdit?: boolean
}) => {
  const { data: session } = useSession()
  const router = useRouter()

  const form = useForm<BizUpdateType>({
    defaultValues: {
      id: biz.id,
      name: biz.name,
      description: biz.description ?? undefined,
      links: biz.links,
      story: biz.story ?? undefined,
      tags: biz.tagsToBusinesses.map((ttb) => ttb.tag.id),
    },
  })
  const { control, watch, getValues, setValue } = form
  const linksLocal = watch('links')
  const tagsLocal = watch('tags')

  const { toast } = useToast()
  const { mutate } = api.business.update.useMutation({
    onSuccess: () => {
      toast({ description: 'Updated profile successfully' })
    },
    onError: (err) => {
      toast({
        description: `Failed to update profile due to ${err.message}`,
        variant: 'destructive',
      })
    },
  })
  const onSubmit = useCallback(async () => {
    mutate({ ...getValues(), id: biz.id })
  }, [biz.id, getValues, mutate])

  return (
    <main className="flex min-h-screen w-full flex-col gap-2 pb-6">
      <Navbar showSearch={!isEdit} />
      {isEdit && (
        <div className="flex w-full justify-between px-4">
          <div>✏️ You&apos;re currently editing this business page.</div>
          <div className="flex gap-2">
            <Button onClick={onSubmit}>Save</Button>
            <Button
              variant="destructive"
              onClick={() => router.push(`/biz/${biz.id}`)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {!isEdit && biz.ownerId === session?.user.id && (
        <div className="flex w-full justify-end px-4">
          <Button onClick={() => router.push(`/biz/${biz.id}/edit`)}>
            Edit
          </Button>
        </div>
      )}
      <div className="flex w-full place-content-center pt-4">
        <div className="flex w-9/12 flex-col gap-6">
          <Form {...form}>
            {/* biz header */}
            <div className="flex w-full justify-between gap-8">
              <div className="flex w-full gap-8">
                {/* logo */}
                <Image
                  src="/assets/paperbag.svg"
                  height={96}
                  width={96}
                  alt="paperbag"
                />
                {/* name & description */}
                <div className="flex w-full flex-col gap-2 self-center">
                  <NameField
                    isEdit={isEdit}
                    value={biz.name}
                    control={control}
                  />
                  <DescriptionField
                    isEdit={isEdit}
                    value={biz.description ?? ''}
                    control={control}
                  />
                </div>
              </div>

              {/* links */}
              <div className="flex min-w-56 flex-col gap-1 self-center">
                <LinkField
                  isEdit={isEdit}
                  values={linksLocal ?? []}
                  setValue={setValue}
                />
              </div>
            </div>

            {/* tags */}
            <div className="flex w-full gap-4">
              <TagsField
                isEdit={isEdit}
                tagList={tagList}
                values={tagsLocal ?? []}
                setValue={setValue}
              />
            </div>

            {/* product highlights */}
            <div className="flex flex-col gap-2">
              <div className="text-lg font-bold text-primary">
                🌈 Product Highlights
              </div>
              <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {/* TODO */}
                <ProductCard
                  img={'/assets/logo-lg.svg'}
                  name="Large product"
                  description="Largest product ever"
                />
                <ProductCard
                  img={'/assets/paperbag.svg'}
                  name="Large product"
                  description="Largest product ever"
                />
                <ProductCard
                  img={'/assets/logo-header.svg'}
                  name="Large product"
                  description="Largest product ever"
                />
                <ProductCard
                  img={'/assets/logo-lg.svg'}
                  name="Large product"
                  description="Largest product ever"
                />
                {isEdit && <Button>🛍️ Add Product</Button>}
              </div>
            </div>

            {/* story */}
            {(biz.story ?? isEdit) && (
              <div className="flex flex-col gap-2">
                <div className="text-lg font-bold text-primary">
                  📖 Our Story
                </div>
                <StoryField
                  isEdit={isEdit}
                  control={control}
                  value={biz.story ?? ''}
                />
              </div>
            )}
          </Form>
        </div>
      </div>
    </main>
  )
}
