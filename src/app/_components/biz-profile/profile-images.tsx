'use client'

import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  type BizUpdateType,
  type Business,
} from '@/server/api/routers/business'
import { api } from '@/trpc/react'
import { type UseFormSetValue } from 'react-hook-form'

import { UploadButton } from './upload-button'

export const ProfileImages = ({
  biz,
  setValue,
  isEdit,
}: {
  biz: Business
  setValue: UseFormSetValue<BizUpdateType>
  isEdit?: boolean
}) => {
  const [images, setImages] = useState(
    biz.businessImages.map((bi) => bi.uploadId),
  )
  const onUpload = useCallback(
    (uploadId: number, idx?: number) => {
      const newArr = [...images]
      newArr[idx ?? images.length] = uploadId
      setImages(newArr)
      setValue('images', newArr)
    },
    [images, setImages, setValue],
  )

  const swapBigImage = useCallback(
    (idx: number) => {
      setImages((images: number[]) => {
        const newArr = [...images]
        if (newArr[idx] && newArr[0]) {
          const temp = newArr[idx]
          newArr[idx] = newArr[0]
          newArr[0] = temp
        }
        return newArr
      })
    },
    [setImages],
  )

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2">
        {images.slice(1).map((id, idx) => (
          <ImageDisplay
            key={id}
            inputId={`img-${idx + 1}-replace`}
            isEdit={isEdit ?? false}
            bizId={biz.id}
            onClick={isEdit ? undefined : () => swapBigImage(idx + 1)}
            initialUploadId={id}
            onUpload={(id) => {
              onUpload(id, idx + 1)
            }}
            className="h-16 w-16"
          />
        ))}
        {/* arbitary limit for no. of uploaded images */}
        {isEdit && images.length < 5 && images.length > 0 && (
          <UploadButton
            inputId="additional-upload"
            bizId={biz.id}
            text="+"
            className="h-16 w-16 cursor-pointer place-content-center bg-primary text-center text-xl text-primary-foreground"
            onUpload={onUpload}
          />
        )}
      </div>
      <div className="h-auto w-72">
        {!isEdit && !images[0] && <div>No images found</div>}
        {images[0] && (
          <ImageDisplay
            key={images[0]}
            inputId="img-0-replace"
            isEdit={isEdit ?? false}
            bizId={biz.id}
            initialUploadId={images[0]}
            onUpload={(id) => onUpload(id, 0)}
            className="h-72 w-72"
            replacePosition="bottom-[-25px] mx-auto"
          />
        )}
        {isEdit && !images[0] && (
          <UploadButton
            inputId="img-0-upload"
            bizId={biz.id}
            text="+"
            className="h-72 w-72 cursor-pointer place-content-center bg-primary text-center text-xl text-primary-foreground"
            onUpload={(id) => onUpload(id, 0)}
          />
        )}
      </div>
    </div>
  )
}

const ImageDisplay = ({
  isEdit,
  bizId,
  onUpload,
  onClick,
  initialUploadId,
  inputId,
  // styles
  className,
  replacePosition,
}: {
  isEdit: boolean
  bizId: number
  onUpload: (id: number) => void
  onClick?: VoidFunction
  initialUploadId: number
  inputId: string
  // styles
  className?: string
  replacePosition?: string
}) => {
  const [uploadId, setUploadId] = useState(initialUploadId)
  const [imageSrc] = api.upload.get.useSuspenseQuery({
    id: uploadId ?? 0, // should not run
    businessId: bizId ?? 0,
  })

  return (
    <div
      className={cn(
        'group relative flex cursor-pointer flex-col place-content-center gap-2',
        className,
      )}
      onClick={onClick}
    >
      <div className="relative h-full w-full place-content-center">
        <picture>
          <img
            src={imageSrc.url}
            className="object-cover"
            alt={imageSrc.name}
          />
        </picture>
      </div>
      {isEdit && (
        <div className={cn('absolute', replacePosition ?? 'left-[-75px]')}>
          <UploadButton
            inputId={inputId}
            className="hidden h-10 w-auto cursor-pointer place-content-center rounded-md bg-primary px-2 text-center text-primary-foreground group-hover:block"
            bizId={bizId}
            text="Replace"
            onUpload={(newId) => {
              setUploadId(newId)
              onUpload?.(newId)
            }}
          />
        </div>
      )}
    </div>
  )
}
