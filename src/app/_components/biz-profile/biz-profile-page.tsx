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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  type BizUpdateType,
  type Business,
} from '@/server/api/routers/business'
import { type Tag } from '@/server/db/schema'
import { api } from '@/trpc/react'
import { useForm } from 'react-hook-form'

import { Bookmark } from './bookmark'
import { ProfileImages } from './profile-images'

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
      images: biz.businessImages.map((bi) => bi.uploadId),
      products: biz.products,
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
          <div className="flex w-full justify-between bg-accent px-4 py-1">
            <div className="self-center">
              ✏️ You&apos;re currently editing this business page.
            </div>
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
          <div className="flex w-full flex-col gap-6 md:w-9/12">
            {/* biz header */}
            <div className="flex w-full flex-wrap place-content-center gap-8 px-4 md:flex-nowrap">
              {/* images */}
              <ProfileImages isEdit={isEdit} biz={biz} setValue={setValue} />

              {/* name & description */}
              <div className="flex w-full grow flex-col gap-8">
                <div className="flex w-full">
                  <div className="flex w-full grow flex-col gap-3">
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
                  <div className="flex min-w-10 md:hidden">
                    {!isEdit && <Bookmark bizId={biz.id} />}
                  </div>
                </div>
                {/* tags */}
                <TagsField
                  isEdit={isEdit}
                  tagList={tagList}
                  values={tagsLocal ?? []}
                  setValue={setValue}
                />

                {/* links */}
                <LinkField
                  isEdit={isEdit}
                  values={linksLocal ?? []}
                  setValue={setValue}
                />
              </div>

              <div className="flex hidden min-w-10 md:block">
                {!isEdit && <Bookmark bizId={biz.id} />}
              </div>
            </div>
            {/* tabs */}
            <Tabs defaultValue="highlights" className="w-full px-4">
              <TabsList className="w-full bg-accent text-accent-foreground">
                {/*  eslint-disable-next-line  */}
                {(isEdit || biz.story) && (
                  <TabsTrigger value="story">📖 Our Story</TabsTrigger>
                )}
                <TabsTrigger value="highlights">
                  🌈 Product Highlights
                </TabsTrigger>
              </TabsList>
              <TabsContent value="story">
                <StoryField
                  isEdit={isEdit}
                  control={control}
                  value={biz.story ?? ''}
                />
              </TabsContent>
              <TabsContent value="highlights">
                <ProductsField
                  products={biz.products}
                  bizId={biz.id}
                  isEdit={isEdit}
                  setValue={setValue}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Form>
    </main>
  )
}
