'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { notFound, useParams } from 'next/navigation'
import {
  DescriptionField,
  EditableField,
  NameField,
  StoryField,
} from '@/app/_components/biz-profile/form-fields'
import { Link } from '@/app/_components/biz-profile/link'
import { ProductCard } from '@/app/_components/biz-profile/product-card'
import { Navbar } from '@/app/_components/navbar'
import { Tag } from '@/app/_components/tag'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { type BizUpdateType } from '@/server/api/routers/business'
import { Business } from '@/server/db/schema'
import { api } from '@/trpc/react'
import { useForm } from 'react-hook-form'

export const BizProfilePage = ({
  biz,
  isEdit,
}: {
  biz: Business
  isEdit?: boolean
}) => {
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
    void mutate({ ...getValues(), id: biz.id })
  }, [])

  return (
    <main className="bg-bg-main flex min-h-screen w-full flex-col gap-2 pb-6">
      <Navbar />
      <div className="flex w-full place-content-center pt-4">
        <div className="flex w-9/12 flex-col gap-6">
          <Form {...form}>
            {/* biz header */}
            <div className="flex w-full justify-between">
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
                {biz.links.map((l, idx) => (
                  <Link key={idx} href={l} />
                ))}
                {isEdit && <Button>🔗 Add Link</Button>}
              </div>
            </div>
            <div className="flex w-full gap-4">
              {biz.tagsToBusinesses?.map(({ tag }) => (
                <Tag key={tag.id} tag={tag} />
              ))}
              {isEdit && <Button>🏷️ Add Tag</Button>}
            </div>

            {/* product highlights */}
            <div className="flex flex-col gap-2">
              <div className="text-primary text-lg font-bold">
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
            {(biz.story || isEdit) && (
              <div className="flex flex-col gap-2">
                <div className="text-primary text-lg font-bold">
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
