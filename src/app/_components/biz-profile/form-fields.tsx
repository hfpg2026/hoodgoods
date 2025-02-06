'use client'

import { useCallback, useMemo, useState, type ReactNode } from 'react'
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/ui/multiselect'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  type BizUpdateType,
  type Business,
  type Product,
} from '@/server/api/routers/business'
import { type Tag as TagType } from '@/server/db/schema'
import _ from 'lodash'
import { type Control, type UseFormSetValue } from 'react-hook-form'

import { Tag } from '../tag'
import { toTitleCase } from '../utils/str'
import { Link } from './link'
import { EditProductCardDialogContent, ProductCard } from './product-card'

type FieldPropTypes = {
  isEdit?: boolean
  value?: string
  control: Control<BizUpdateType>
}

export const EditableField = ({
  isEdit,
  value,
  editField,
  ...props
}: {
  editField: ReactNode
} & Omit<FieldPropTypes, 'control'> &
  React.HTMLAttributes<HTMLDivElement>) => {
  return isEdit ? editField : <div {...props}>{value}</div>
}

export const NameField = ({ isEdit, value, control }: FieldPropTypes) => {
  return (
    <EditableField
      isEdit={isEdit}
      className="text-4xl font-bold text-primary"
      value={value}
      editField={
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Business Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      }
    />
  )
}

export const DescriptionField = ({
  isEdit,
  value,
  control,
}: FieldPropTypes) => {
  return (
    <EditableField
      className="italic"
      isEdit={isEdit}
      value={value}
      editField={
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Business Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      }
    />
  )
}

export const PostalCodeField = ({
  isEdit,
  control,
  nearestMrt,
  nearestMrtDistance,
}: FieldPropTypes & Pick<Business, 'nearestMrt' | 'nearestMrtDistance'>) => {
  return isEdit ? (
    <FormField
      control={control}
      name="postalCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger>Postal Code ⓘ</TooltipTrigger>
                <TooltipContent>
                  <p>
                    This will not be shown to anyone else. Only nearest mrt is
                    shown.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <Input placeholder="Postal Code" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ) : nearestMrt && nearestMrtDistance ? (
    <div className="text-sm">
      📍{' '}
      {Number(nearestMrtDistance) < 1000
        ? Number(nearestMrtDistance).toFixed(0) + 'm'
        : (Number(nearestMrtDistance) / 1000).toFixed(0) + 'km'}{' '}
      from {toTitleCase(nearestMrt)}
    </div>
  ) : (
    <></>
  )
}

export const StoryField = ({ isEdit, value, control }: FieldPropTypes) => {
  return (
    <EditableField
      isEdit={isEdit}
      value={value}
      className="whitespace-pre-line"
      editField={
        <FormField
          control={control}
          name="story"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Our Story" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      }
    />
  )
}

export const PublishedField = ({ control }: FieldPropTypes) => {
  return (
    <FormField
      control={control}
      name="isPublished"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center space-x-2">
            <FormControl>
              <Switch
                id="isPublished"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <Label htmlFor="isPublished">Published</Label>
          </div>
        </FormItem>
      )}
    />
  )
}

export const LinkField = ({
  isEdit,
  values,
  setValue,
}: {
  isEdit?: boolean
  values: string[]
  setValue: UseFormSetValue<BizUpdateType>
}) => {
  const [links, setLinks] = useState(values.join(', ') ?? '')
  const onSave = (links: string) => {
    const linksArr = _.uniq(
      // TOOD safer way to do this?
      links.split(',').map((l) => {
        let url: URL
        try {
          url = new URL(l.trim())
        } catch (e) {
          // try inputting https:// infront
          url = new URL(`//${l.trim()}`, 'https://hoodgoods.hack2025.gov.sg')
        }
        return url.toString()
      }),
    )
    setValue('links', linksArr)
  }
  return (
    <div className="flex items-center gap-3">
      {values.map((l, idx) => (
        <Link key={idx} href={l} />
      ))}
      {isEdit && (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add / Edit Links</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>🔗 Add / Edit Links</DialogTitle>
              <DialogDescription>
                Please enter all links that you would like displayed on your
                business page. Multiple links can be separated by &apos;,&apos;.
                <Textarea
                  className="mt-4"
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                  placeholder="instagram.com, google.com"
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => onSave(links)}
                >
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export const TagsField = ({
  isEdit,
  values,
  setValue,
  tagList,
}: {
  isEdit?: boolean
  values: number[]
  tagList: TagType[]
  setValue: UseFormSetValue<BizUpdateType>
}) => {
  const tagOptions = useMemo(
    () => tagList.map((t) => ({ value: t.id.toString(), label: t.name })),
    [tagList],
  )
  const tagById = useMemo(() => _.groupBy(tagList, 'id'), [tagList])
  const [selectedTags, setSelectedTags] = useState<string[]>(
    values.map((v) => v.toString()),
  )
  const onSave = (tags: string[]) => {
    setValue(
      'tags',
      tags.map((t) => Number(t)),
    )
  }

  return (
    <div className="align-center flex gap-2">
      {values.map(
        (t) => tagById[t]?.[0] && <Tag key={t} tag={tagById[t]?.[0]} />,
      )}
      {isEdit && (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add / Edit Tags</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>🏷️ Add / Edit Tags</DialogTitle>
              <DialogDescription>
                Please select all tags that you would like to attribute to your
                business.
                <MultiSelect
                  className="mt-4"
                  options={tagOptions}
                  onValueChange={setSelectedTags}
                  defaultValue={selectedTags}
                  placeholder="Select Tags"
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => onSave(selectedTags)}
                >
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export const ProductsField = ({
  isEdit,
  products: originalProducts,
  bizId,
  setValue,
}: {
  isEdit?: boolean
  products: Product[]
  bizId: number
  setValue: UseFormSetValue<BizUpdateType>
}) => {
  const [products, setProducts] = useState(originalProducts)
  const onProductAdd = (p: Product) => {
    const newProducts = [...products, p]
    setProducts(newProducts)
    setValue('products', newProducts)
  }
  const onProductUpdate = (p: Product) => {
    const oldProductIndex = products.findIndex(({ id }) => id === p.id)
    const newProducts = products
      .slice(0, oldProductIndex)
      .concat(p)
      .concat(products.slice(oldProductIndex + 1))
    setProducts(newProducts)
    setValue('products', newProducts)
  }
  const onProductDelete = (pid: number) => {
    const newProducts = products.filter((p) => p.id !== pid)
    setProducts(newProducts)
    setValue('products', newProducts)
  }

  if (!isEdit && products.length === 0) {
    return (
      <div key={0} className="w-full text-center">
        Oops, this business hasn&apos;t listed any products yet!
      </div>
    )
  }

  return (
    <div
      key={1}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {products.map((p) => (
        <ProductCard key={p.id} {...p} bizId={bizId} isEdit={isEdit} />
      ))}

      {isEdit && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">🛍️ Add Product</Button>
          </DialogTrigger>
          <EditProductCardDialogContent
            bizId={bizId}
            onProductAdd={onProductAdd}
            onProductUpdate={onProductUpdate}
            onProductDelete={onProductDelete}
          />
        </Dialog>
      )}
    </div>
  )
}
