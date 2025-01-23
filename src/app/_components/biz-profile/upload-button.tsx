'use client'

import { useCallback, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateS3ObjectKey } from '@/lib/s3'
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
  const { mutateAsync: generatePresignedurl } =
    api.upload.generatePresignedUrl.useMutation({
      trpc: { abortOnUnmount: true },
    })
  const { mutateAsync: createUpload } = api.upload.upload.useMutation({
    trpc: { abortOnUnmount: true },
  })

  const uploadFile = useCallback(async () => {
    const formData = new FormData()
    const file = fileInput?.current?.files?.[0]
    if (!file) throw new Error('file not found')
    formData.append('file', file)

    const s3ObjectKey = generateS3ObjectKey(file.name, bizId)
    // upload
    const { url } = await generatePresignedurl({ s3ObjectKey })
    await fetch(url, {
      method: 'PUT',
      body: formData,
    })
    // create in db
    const upload = await createUpload({
      name: file.name,
      sizeInBytes: file.size,
      s3ObjectKey,
      businessId: bizId,
    })

    onUpload?.(upload.id)
  }, [bizId, createUpload, onUpload, generatePresignedurl])

  return (
    <form className="flex min-w-20 place-content-center">
      <Input
        id="file"
        type="file"
        className="inputfile"
        accept={IMG_EXTENSIONS.join(',')}
        ref={fileInput}
        onChange={uploadFile}
      />
      <Label htmlFor="file">💾 Upload</Label>
    </form>
  )
}
