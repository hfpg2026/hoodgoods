'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  DescriptionField,
  LinkField,
  NameField,
  PostalCodeField,
  ProductsField,
  PublishedField,
  StoryField,
  TagsField,
} from '@/app/_components/biz-profile/form-fields'
import { Navbar } from '@/app/_components/navbar'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import {
  type BizUpdateType,
  type Business,
} from '@/server/api/routers/business'
import { type Tag } from '@/server/db/schema'
import { api } from '@/trpc/react'
import { useForm } from 'react-hook-form'

import { Bookmark } from './bookmark'
import { ImageUpload } from './image-upload'

export const BizProfilePage = ({
  biz,
  tagList,
  isEdit,
}: {
  biz: Business
  tagList: Tag[]
  isEdit?: boolean
}) => {
  const router = useRouter()

  const form = useForm<BizUpdateType>({
    defaultValues: {
      id: biz.id,
      isPublished: biz.isPublished ?? false,
      name: biz.name,
      description: biz.description ?? undefined,
      links: biz.links,
      story: biz.story ?? undefined,
      tags: biz.tagsToBusinesses.map((ttb) => ttb.tag.id),
      postalCode: biz.postalCode ?? undefined,
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
    <main className="flex min-h-screen w-full flex-col gap-2 bg-background pb-6">
      <Navbar showSearch={!isEdit} />
      <Form {...form}>
        {isEdit && (
          <div className="flex w-full justify-between px-4">
            <div>✏️ You&apos;re currently editing this business page.</div>
            <div className="flex items-center gap-2">
              <PublishedField control={control} />
              <Button className="ml-2" onClick={onSubmit}>
                Save
              </Button>
              <Button
                variant="destructive"
                onClick={() => router.push(`/biz/${biz.id}`)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        <div className="flex w-full place-content-center pt-4">
          <div className="flex w-9/12 flex-col gap-6">
            {/* biz header */}
            <div className="flex w-full flex-wrap justify-between gap-8">
              <div className="flex w-full max-w-screen-md gap-8">
                {/* logo */}
                <ImageUpload
                  isEdit={isEdit}
                  bizId={biz.id}
                  uploadId={biz.logoId}
                  onUpload={(uploadId) => setValue('logoId', uploadId)}
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
                  <PostalCodeField
                    isEdit={isEdit}
                    control={control}
                    nearestMrt={biz.nearestMrt}
                    nearestMrtDistance={biz.nearestMrtDistance}
                  />
                </div>
              </div>

              {/* links */}
              <div className="flex min-w-40 gap-4 self-center">
                <LinkField
                  isEdit={isEdit}
                  values={linksLocal ?? []}
                  setValue={setValue}
                />
                {!isEdit && <Bookmark bizId={biz.id} />}
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
              <ProductsField
                products={biz.products}
                bizId={biz.id}
                isEdit={isEdit}
                setValue={setValue}
              />
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
          </div>
        </div>
      </Form>
    </main>
  )
}
