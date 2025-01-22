import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type DeleteObjectCommandInput,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_ACCESS_KEY_SECRET ?? '',
  },
})

export const getObjectUrl = async (key: string) => {
  return await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 3600 },
  )
}

export const generatePutObjectUrl = async (key: string) => {
  console.log('BUCKET', process.env.R2_BUCKET_NAME)
  return await getSignedUrl(
    s3Client,
    new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }),
    { expiresIn: 3600 },
  )
}

export const deleteObject = async (params: DeleteObjectCommandInput) => {
  return await s3Client.send(new DeleteObjectCommand(params))
}

export const generateS3ObjectKey = (
  filename: string,
  bizId: number,
): string => {
  const splitFilename = filename.split('.')
  // filename always comes with ext
  const fileExt = splitFilename.pop()!
  const filenameWithoutExt = splitFilename.join('.')
  return `${bizId}/${filenameWithoutExt}_${new Date().getTime()}.${fileExt}`
}
