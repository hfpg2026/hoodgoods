'use client'

import { useCallback, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { generatePutObjectUrl, generateS3ObjectKey } from '@/lib/s3'
import { api } from '@/trpc/react'

const IMG_EXTENSIONS = ['.jpg', '.jpeg', '.png']

export const UploadButton = ({
  bizId,
  onUpload,
}: {
  bizId: number
  onUpload?: (uploadId: number) => void
}) => {
  const fileInput = useRef<HTMLInputElement>(null)
  const { mutateAsync: createUpload } = api.upload.upload.useMutation({
    trpc: { abortOnUnmount: true },
  })

  const uploadFile = useCallback(async () => {
    const formData = new FormData()
    const file = fileInput?.current?.files?.[0]
    if (!file) throw new Error('file not found')
    formData.append('file', file)

    const s3ObjectKey = generateS3ObjectKey(file.name, bizId)
    // create upload in db
    const upload = await createUpload({
      name: file.name,
      sizeInBytes: file.size,
      s3ObjectKey,
      businessId: bizId,
    })
    // upload to s3
    const url = await generatePutObjectUrl(s3ObjectKey)
    await fetch(url, {
      method: 'POST',
      body: formData,
    })

    onUpload?.(upload.id)
  }, [bizId, createUpload, onUpload])

  return (
    <form className="flex flex-col gap-4">
      <Input
        id="picture"
        type="file"
        accept={IMG_EXTENSIONS.join(',')}
        ref={fileInput}
        onChange={uploadFile}
      />
    </form>
  )
}
