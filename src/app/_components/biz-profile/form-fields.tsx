import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { BizUpdateType } from '@/server/api/routers/business'
import { Business } from '@/server/db/schema'
import { Control, useFieldArray } from 'react-hook-form'

type FieldPropTypes = {
  isEdit?: boolean
  value?: string
  control: Control<BizUpdateType>
}

export const EditableField = ({
  isEdit,
  value,
  editField,
  placeholder = '',
  ...props
}: {
  placeholder?: string
  editField: ReactNode
} & Omit<FieldPropTypes, 'control'> &
  React.HTMLAttributes<HTMLDivElement>) => {
  return isEdit ? editField : <div {...props}>{value}</div>
}

export const NameField = ({ isEdit, value, control }: FieldPropTypes) => {
  return (
    <EditableField
      isEdit={isEdit}
      className="text-primary text-4xl font-bold"
      value={value}
      placeholder="My Business"
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
      placeholder="Description"
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
      placeholder="Our Story"
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
