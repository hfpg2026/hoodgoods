'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { type Product } from '@/server/api/routers/business'
import { api } from '@/trpc/react'
import { useForm } from 'react-hook-form'

import { UploadButton } from './upload-button'

export const ProductCard = ({
  isEdit,
  bizId,
  ...originalProduct
}: Product & { isEdit?: boolean; bizId: number }) => {
  const [product, setProduct] = useState(originalProduct)

  const { data: imageSrc } = api.upload.get.useQuery(
    {
      id: product.imageId ?? 0, // should not run
      businessId: bizId,
    },
    { enabled: !!product.imageId },
  )

  return (
    <div className="flex h-full flex-col gap-2 rounded-lg bg-accent shadow-md">
      <div className="h-[250px] w-full self-center">
        {imageSrc ? (
          <picture>
            <img
              src={imageSrc.url}
              className="h-full w-full rounded-t-lg object-cover"
              alt={imageSrc.name}
            />
          </picture>
        ) : product.imageId ? (
          <Skeleton className="h-[250px] w-full rounded-lg" />
        ) : (
          <Image
            src="/assets/paperbag.svg"
            height={80}
            width={80}
            className="relative object-contain pt-2"
            alt="no-image"
          />
        )}
      </div>
      <div className="flex h-full flex-col justify-between gap-3 px-4 pb-4">
        <div className="flex-col gap-2">
          <div className="font-bold">{product.name}</div>
          <div className="whitespace-pre-line italic">
            {product.description}
          </div>
        </div>
        {isEdit && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Edit Product</Button>
            </DialogTrigger>
            <EditProductCardDialogContent
              bizId={bizId}
              product={product}
              onProductUpdate={setProduct}
            />
          </Dialog>
        )}
      </div>
    </div>
  )
}

export const EditProductCardDialogContent = ({
  bizId,
  product,
  onProductAdd,
  onProductUpdate,
  onProductDelete,
}: {
  bizId: number
  product?: Product
  onProductAdd?: (product: Product) => void
  onProductUpdate?: (product: Product) => void
  onProductDelete?: (productId: number) => void
}) => {
  const form = useForm<Product>({
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      imageId: product?.imageId ?? undefined,
    },
  })
  const { control, setValue, getValues } = form

  const onSave = async () => {
    const values = getValues()
    if (!product) {
      onProductAdd?.(values)
      form.reset()
    } else {
      onProductUpdate?.(values)
    }
  }
  const onDelete = () => {
    if (!product) {
      // do nothing
    } else {
      onProductDelete?.(product.id!)
    }
    form.reset()
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{product ? 'Edit' : 'Add'} Product</DialogTitle>
        <DialogDescription />
      </DialogHeader>
      <Form {...form}>
        <div className="flex flex-col gap-2 p-2">
          <ImageUpload
            bizId={bizId}
            initialUploadId={product?.imageId ?? undefined}
            onUpload={(uploadId) => {
              setValue('imageId', uploadId)
            }}
          />
          {/* name */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* description */}
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Product Description"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <div className="flex w-full gap-3">
            <Button type="button" className="w-full" onClick={onSave}>
              Save
            </Button>
            <Button
              type="button"
              className="w-full"
              variant="destructive"
              onClick={onDelete}
            >
              {product ? 'Delete' : 'Cancel'}
            </Button>
          </div>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

const ImageUpload = ({
  bizId,
  initialUploadId,
  onUpload,
}: {
  bizId: number
  initialUploadId?: number
  onUpload?: (id: number) => void
}) => {
  const [uploadId, setUploadId] = useState(initialUploadId)
  const { data: imageSrc } = api.upload.get.useQuery(
    {
      id: uploadId ?? 0, // should not run
      businessId: bizId ?? 0,
    },
    { enabled: !!uploadId && !!bizId },
  )

  return (
    <>
      {imageSrc ? (
        <div className="h-[250px] w-full">
          <picture>
            <img
              src={imageSrc.url}
              className="h-full w-full object-cover"
              alt={imageSrc.name}
            />
          </picture>
        </div>
      ) : uploadId ? (
        <Skeleton className="h-[250px] w-full rounded-xl" />
      ) : (
        <></>
      )}
      <UploadButton
        inputId="product-img"
        className="h-10 w-auto cursor-pointer place-content-center rounded-md bg-primary px-2 text-center text-primary-foreground"
        bizId={bizId}
        text={imageSrc ? 'Replace Image' : `Add Image`}
        onUpload={(uploadId) => {
          setUploadId(uploadId)
          onUpload?.(uploadId)
        }}
      />
    </>
  )
}
