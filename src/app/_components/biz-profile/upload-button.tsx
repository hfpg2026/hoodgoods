'use client'

import { useCallback, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateS3ObjectKey } from '@/lib/s3'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'

const IMG_EXTENSIONS = ['.jpg', '.jpeg', '.png']

export const UploadButton = ({
  bizId,
  onUpload,
  className,
  text,
}: {
  bizId: number
  onUpload?: (uploadId: number) => void
  className?: React.ComponentProps<'label'>['className']
  text?: string
}) => {
  const fileInput = useRef<HTMLInputElement>(null)
  const { mutateAsync: generatePresignedurl } =
    api.upload.generatePresignedUrl.useMutation({
      trpc: { abortOnUnmount: true },
    })
  const { mutateAsync: createUpload } = api.upload.upload.useMutation({
    trpc: { abortOnUnmount: true },
  })
  const [err, setErr] = useState('')

  const uploadFile = useCallback(async () => {
    const file = fileInput?.current?.files?.[0]
    if (!file) {
      setErr('File not found')
      throw new Error(err)
    }
    if (file.size >= 2097152) {
      // 2mb
      setErr('File too large, please upload file < 2MB')
      throw new Error(err)
    }

    const s3ObjectKey = generateS3ObjectKey(file.name, bizId)
    // upload
    const { url } = await generatePresignedurl({ s3ObjectKey })
    await fetch(url, {
      method: 'PUT',
      body: file,
    })
    // create in db
    const upload = await createUpload({
      name: file.name,
      sizeInBytes: file.size,
      s3ObjectKey,
      businessId: bizId,
    })

    onUpload?.(upload.id)
  }, [bizId, createUpload, onUpload, generatePresignedurl, err])

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
      <Label htmlFor="file" className={cn('ml-[-16px]', className)}>
        {text ?? '💾 Upload'}
      </Label>
    </form>
  )
}
