import { useState } from 'react'
import Image from 'next/image'
import { api } from '@/trpc/react'

import { UploadButton } from './upload-button'

export const ImageUpload = ({
  isEdit,
  bizId,
  uploadId: initialUploadId,
  onUpload,
}: {
  isEdit?: boolean
  bizId: number
  uploadId?: number | null
  onUpload?: (uploadId: number) => void
}) => {
  const [uploadId, setUploadId] = useState(initialUploadId)
  const { data: imageSrc } = api.upload.get.useQuery(
    {
      id: uploadId ?? 0, // should not run
      businessId: bizId ?? 0,
    },
    { enabled: !!uploadId && !!bizId },
  )

  const src = imageSrc ? imageSrc.url : '/assets/paperbag.svg'
  return (
    <div className="max-w-50 group relative flex place-content-center">
      <div className="max-w-30 h-auto place-content-center group-hover:opacity-30">
        <Image src={src} width={96} height={96} alt="logo" />
      </div>
      <div className="align-center absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] opacity-0 group-hover:opacity-100">
        {isEdit && (
          <UploadButton
            bizId={bizId}
            onUpload={(uploadId) => {
              setUploadId(uploadId)
              onUpload?.(uploadId)
            }}
          />
        )}
      </div>
    </div>
  )
}
