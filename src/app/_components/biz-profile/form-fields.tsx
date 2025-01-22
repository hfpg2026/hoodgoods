import { useMemo, useState, type ReactNode } from 'react'
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multiselect'
import { Textarea } from '@/components/ui/textarea'
import { type BizUpdateType } from '@/server/api/routers/business'
import { type Tag as TagType } from '@/server/db/schema'
import { api } from '@/trpc/react'
import _ from 'lodash'
import { type Control, type UseFormSetValue } from 'react-hook-form'

import { Tag } from '../tag'
import { Link } from './link'
import { UploadButton } from './upload-button'

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
      className="italics"
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
    const linksArr = _.uniq(links.split(',').map((l) => l.trim()))
    setValue('links', linksArr)
  }
  return (
    <div className="flex flex-col gap-2">
      {values.map((l, idx) => (
        <Link key={idx} href={l} />
      ))}
      {isEdit && (
        <Dialog>
          <DialogTrigger asChild>
            <Button>🔗 Add / Edit Links</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add / Edit Links</DialogTitle>
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
    <div className="flex gap-2">
      {values.map(
        (t) => tagById[t]?.[0] && <Tag key={t} tag={tagById[t]?.[0]} />,
      )}
      {isEdit && (
        <Dialog>
          <DialogTrigger asChild>
            <Button>🏷️ Add / Edit Tags</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add / Edit Tags</DialogTitle>
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

export const LogoField = ({
  isEdit,
  bizId,
  uploadId: initialUploadId,
}: {
  isEdit?: boolean
  bizId: number
  uploadId?: number | null
}) => {
  const [uploadId, setUploadId] = useState(initialUploadId)
  const { data: imageSrc } = api.upload.get.useQuery(
    {
      id: uploadId ?? 0, // should not run
      businessId: bizId,
    },
    { enabled: !!uploadId },
  )

  const src = imageSrc ? imageSrc.url : '/assets/paperbag.svg'
  return (
    <div className="max-w-50 group relative">
      <Image
        className="w-full group-hover:opacity-30"
        src={src}
        width={96}
        height={96}
        alt="logo"
      />
      <div className="align-center absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] opacity-0 group-hover:opacity-100">
        {isEdit && (
          <UploadButton
            bizId={bizId}
            onUpload={(uploadId) => {
              setUploadId(uploadId)
              console.log(uploadId)
            }}
          />
        )}
      </div>
    </div>
  )
}
