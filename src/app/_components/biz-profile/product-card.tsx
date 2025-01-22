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
import { Textarea } from '@/components/ui/textarea'
import {
  type Product,
  type ProductUpdateType,
} from '@/server/api/routers/product'
import { api } from '@/trpc/react'
import { useForm } from 'react-hook-form'

import { ImageUpload } from './image-upload'

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
    <div className="flex h-full flex-col gap-2 rounded-lg bg-accent p-4 shadow-md">
      <div className="grow-1 self-center">
        <Image
          src={imageSrc?.url ?? '/assets/paperbag.svg'}
          alt={product.name}
          width={200}
          height={200}
        />
      </div>
      <div className="flex grow-0 flex-col gap-1">
        <div>{product.name}</div>
        <div className="italic">{product.description}</div>
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
  const form = useForm<ProductUpdateType>({
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      imageId: product?.imageId ?? undefined,
      businessId: bizId,
    },
  })
  const { control, setValue, getValues } = form

  const { mutateAsync: create } = api.product.create.useMutation()
  const { mutateAsync: update } = api.product.update.useMutation()
  const onSave = useCallback(async () => {
    const values = getValues()
    if (!product) {
      const newProduct = await create(values)
      onProductAdd?.(newProduct)
      form.reset()
    } else {
      const updatedProduct = await update({ ...values, id: product.id })
      onProductUpdate?.(updatedProduct)
    }
  }, [create, getValues, update, onProductUpdate, onProductAdd, product])
  const onDelete = useCallback(() => {
    if (!product) {
      // do nothing
    } else {
      onProductDelete?.(product.id)
    }
    form.reset()
  }, [onProductDelete, product])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{product ? 'Edit' : 'Add'} Product</DialogTitle>
        <DialogDescription />
      </DialogHeader>
      <Form {...form}>
        <div className="flex flex-col gap-2 p-2">
          <ImageUpload
            isEdit
            bizId={bizId}
            uploadId={product?.imageId}
            onUpload={(uploadId) => setValue('imageId', uploadId)}
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
                  <Textarea placeholder="Product Description" {...field} />
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
